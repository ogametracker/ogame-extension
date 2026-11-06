<template>
    <div>
        <div class="fake-table">
            <div class="fake-table-header">
                <span v-text="translations().extension.settings.linkAccounts.header(currentAccountString)" />
            </div>
            <div class="fake-table-body">
                <span v-html="translations().extension.settings.linkAccounts.descriptionHtml(currentAccountString)" />
                <hr />

                <span v-text="translations().extension.settings.linkAccounts.linkedAccounts" />
                <div v-for="account in linkedAccounts" :key="account.key" class="linked-account">
                    <span class="mdi mdi-delete delete" @click="unlinkAccount(account)" />
                    <span v-text="`${account.name} (${account.universeName})`" />
                </div>

                <hr />

                <div v-text="translations().extension.settings.linkAccounts.linkAccount" />
                <select @change="onAccountSelected(($event.target as HTMLInputElement).value)" v-model="selectedValue">
                    <optgroup
                        v-for="accountGroup in linkableAccounts"
                        :key="accountGroup.serverName"
                        :label="accountGroup.serverName"
                    >
                        <option
                            v-for="account in accountGroup.accounts"
                            :key="account.key"
                            :value="account.key"
                            v-text="account.name"
                        />
                    </optgroup>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { translations } from '@stats/i18n';
import { useUniversesAndAccountsStore } from '../../data/UniversesAndAccountsDataModule';
import type { DbAccount } from '@ogame-tracker/shared/db/schema/global';
import { GlobalOgameMetaData } from '../../data/global';

interface KnownAccount {
    key: string;

    id: number;
    serverId: number;
    serverLanguage: string;

    name: string;
    universeName: string;
}

const universesAndAccountsStore = useUniversesAndAccountsStore();

const selectedValue = ref(null);

const currentAccountString = computed(() => {
    const account = universesAndAccountsStore.currentAccount;
    const server = universesAndAccountsStore.currentServer;

    return `${account.name} - ${server.language.toUpperCase()} ${server.name}`;
});

const linkedAccounts = computed<KnownAccount[]>(() => {
    const linked = universesAndAccountsStore.currentAccount.linkedAccounts ?? [];

    return (
        linked
            .map(acc =>
                universesAndAccountsStore.accounts.find(
                    a => a.serverId == acc.serverId && a.serverLanguage == acc.serverLanguage && a.id == acc.id,
                ),
            )
            .filter(acc => acc != null) as KnownAccount[]
    ).map<KnownAccount>(acc => mapAccount(acc));
});

function mapAccount(acc: DbAccount): KnownAccount {
    const server = universesAndAccountsStore.servers.find(
        s => s.id == acc.serverId && s.language == acc.serverLanguage,
    );
    let serverName = `${acc.serverLanguage.toUpperCase()} ${acc.serverId}`;
    if (server != null) {
        let name = server.name;
        let prefix = `${server.language.toUpperCase()} `;
        if (name.startsWith(prefix)) {
            serverName = name;
        } else {
            serverName = prefix + name;
        }
    }

    return {
        key: `${acc.serverLanguage}-${acc.serverId}-${acc.id}`,
        id: acc.id,
        serverId: acc.serverId,
        serverLanguage: acc.serverLanguage,
        name: acc.name,
        universeName: serverName,
    };
}

const linkableAccounts = computed<{ serverName: string; accounts: KnownAccount[] }[]>(() => {
    const localLinkedAccounts = linkedAccounts.value;

    const accEqual = (
        a: {
            serverId: number;
            serverLanguage: string;
            id: number;
        },
        b: {
            serverId: number;
            serverLanguage: string;
            id: number;
        },
    ) => a.serverId == b.serverId && a.serverLanguage == b.serverLanguage && a.id == b.id;

    const accounts = universesAndAccountsStore.accounts
        .filter(
            a =>
                !accEqual(a, {
                    id: GlobalOgameMetaData.playerId,
                    serverId: GlobalOgameMetaData.serverId,
                    serverLanguage: GlobalOgameMetaData.language,
                }),
        )
        .filter(a => !localLinkedAccounts.some(acc => accEqual(acc, a)))
        .map<KnownAccount>(acc => mapAccount(acc))
        .sort((a, b) => {
            const lang = a.serverLanguage.localeCompare(b.serverLanguage);
            if (lang != 0) {
                return lang;
            }

            if (a.universeName != null && b.universeName == null) {
                return -1;
            }
            if (a.universeName == null && b.universeName != null) {
                return 1;
            }

            const uniId = a.serverId - b.serverId;
            if (uniId != 0) {
                return uniId;
            }

            if (a.name != null && b.name == null) {
                return -1;
            }
            if (a.name == null && b.name != null) {
                return 1;
            }

            return a.id - b.id;
        });

    const groups: Record<string, KnownAccount[]> = {};
    accounts.forEach(acc => {
        const serverKey = `${acc.serverLanguage}-${acc.serverId}`;
        (groups[serverKey] ??= []).push(acc);
    });

    const result = Object.keys(groups)
        .sort()
        .map(key => ({
            serverName: groups[key][0].universeName,
            accounts: groups[key],
        }));
    return result;
});

async function onAccountSelected(key: string) {
    const localLinkableAccounts = linkableAccounts.value.flatMap(gr => gr.accounts);
    const account = localLinkableAccounts.find(a => a.key == key);
    if (account == null) {
        await nextTick();
        selectedValue.value = null;
        return;
    }

    await universesAndAccountsStore.linkAccount({
        serverId: account.serverId,
        serverLanguage: account.serverLanguage,
        id: account.id,
    });

    window.location.reload();
}

async function unlinkAccount(account: KnownAccount) {
    await universesAndAccountsStore.unlinkAccount({
        serverId: account.serverId,
        serverLanguage: account.serverLanguage,
        id: account.id,
    });

    window.location.reload();
}
</script>

<style lang="scss" scoped>
.delete {
    opacity: 0.5;
    font-size: 1.5em;
    display: inline-block;
    cursor: pointer;

    &:hover {
        opacity: 1;
    }
}

.linked-account {
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
}

.fake-table {
    border: 1px solid rgba(var(--color), 0.5);
    border-radius: 4px;
    display: grid;
    width: fit-content;

    &-header {
        background: black linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
        justify-content: center;
        align-items: center;
    }

    &-header,
    &-body {
        height: 100%;
        padding: 8px;
        display: flex;
    }

    &-body {
        flex-direction: column;
        align-items: start;
        justify-content: center;
        gap: 4px;
    }
}

hr {
    width: 100%;
}
</style>
