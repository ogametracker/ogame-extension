<template>
    <div>
        <div class="fake-table">
            <div class="fake-table-header">
                <span v-text="$i18n.$t.extension.settings.linkAccounts.header" />
            </div>
            <div class="fake-table-body">
                <div v-for="account in linkedAccounts" :key="account.key" class="linked-account">
                    <span class="mdi mdi-delete delete" @click="unlinkAccount(account)" />
                    <span v-text="`${account.name} (${account.universeName})`" />
                </div>

                <hr />

                <div v-text="$i18n.$t.extension.settings.linkAccounts.linkAccount" />
                <select @change="onAccountSelected($event.target.value)" v-model="selectedValue">
                    <optgroup v-for="accountGroup in linkableAccounts" :key="accountGroup.serverName" :label="accountGroup.serverName">
                        <option v-for="account in accountGroup.accounts" :key="account.key" :value="account.key" v-text="account.name" />
                    </optgroup>
                </select>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import ExpeditionShipResourceUnitsFactorSettings from '@stats/components/settings/ExpeditionShipResourceUnitsFactorSettings.vue';
    import { UniversesAndAccountsDataModule } from '../../data/UniversesAndAccountsDataModule';
    import { _throw } from '@/shared/utils/_throw';
    import { DbAccount } from '@/shared/db/schema/global';

    interface KnownAccount {
        key: string;

        id: number;
        serverId: number;
        serverLanguage: string;

        name: string;
        universeName: string;
    }

    @Component({
        components: {
            ExpeditionShipResourceUnitsFactorSettings,
        },
    })
    export default class LinkedAccounts extends Vue {
        private selectedValue = null;

        private get linkedAccounts(): KnownAccount[] {
            const linked = UniversesAndAccountsDataModule.currentAccount.linkedAccounts ?? [];

            return (linked.map(acc => UniversesAndAccountsDataModule.accounts.find(
                a => a.serverId == acc.serverId
                    && a.serverLanguage == acc.serverLanguage
                    && a.id == acc.id
            )).filter(acc => acc != null) as KnownAccount[])
                .map<KnownAccount>(acc => this.mapAccount(acc));
        }

        private mapAccount(acc: DbAccount): KnownAccount {
            const server = UniversesAndAccountsDataModule.servers.find(s => s.id == acc.serverId && s.language == acc.serverLanguage);
            let serverName = `${acc.serverLanguage.toUpperCase()} ${acc.serverId}`;
            if (server != null) {
                let name = server.name;
                let prefix = `${server.language.toUpperCase()} `;
                if (name.startsWith(prefix)) {
                    serverName = name;
                }
                else {
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

        private get linkableAccounts(): { serverName: string; accounts: KnownAccount[] }[] {
            const linkedAccounts = this.linkedAccounts;

            const accounts = UniversesAndAccountsDataModule.accounts
                .filter(a => !linkedAccounts.some(acc => acc.id == a.id && acc.serverId == a.serverId && acc.serverLanguage == a.serverLanguage))
                .map<KnownAccount>(acc => this.mapAccount(acc))
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

            const result = Object.keys(groups).sort().map(key => ({
                serverName: groups[key][0].universeName,
                accounts: groups[key],
            }));
            return result;
        }

        private async onAccountSelected(key: string) {
            const linkableAccounts = this.linkableAccounts.flatMap(gr => gr.accounts);
            const account = linkableAccounts.find(a => a.key == key);
            if (account == null) {
                await this.$nextTick();
                this.selectedValue = null;
                return;
            }

            await UniversesAndAccountsDataModule.linkAccount({
                serverId: account.serverId,
                serverLanguage: account.serverLanguage,
                id: account.id,
            });

            window.location.reload();
        }

        private async unlinkAccount(account: KnownAccount) {
            await UniversesAndAccountsDataModule.unlinkAccount({
                serverId: account.serverId,
                serverLanguage: account.serverLanguage,
                id: account.id
            });

            window.location.reload();
        }
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
        max-width: 400px;

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