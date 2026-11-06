<template>
    <CustomDialog show-close @close="emit('close')" :style="`--color: ${getColorVariable(color)};`">
        <LoadingSpinner v-if="!knownAccountsLoaded" />
        <div v-else>
            <div v-text="translations().extension.switchAccounts.title" />
            <select @change="gotoAccount()" v-model="selectedAccountKey">
                <optgroup v-for="accountGroup in knownAccountGroups" :key="accountGroup.serverName" :label="accountGroup.serverName">
                    <option v-for="account in accountGroup.accounts" :key="account.key" :value="account.key" v-text="account.name" />
                </optgroup>
            </select>
        </div>
    </CustomDialog>
</template>

<script setup lang="ts">
import CustomDialog from '@stats/components/common/CustomDialog.vue';
import LoadingSpinner from '@stats/components/common/LoadingSpinner.vue';
import { nextTick, onMounted, ref } from 'vue';
import { translations } from '@stats/i18n';
import type { DbAccount } from '@ogame-tracker/shared/db/schema/global';
import { useUniversesAndAccountsStore } from '../data/UniversesAndAccountsDataModule';
import { getRGBString } from '../utils/getRGBString';

interface KnownAccount {
    key: string;

    id: number;
    universeId: number;
    universeLanguage: string;

    name: string;
    universeName: string;
}

defineProps({
    color: { required: true, type: String },
});

const emit = defineEmits(['close']);

const universesAndAccountsStore = useUniversesAndAccountsStore();

const knownAccountGroups = ref<{ serverName: string; accounts: KnownAccount[] }[]>([]);

const knownAccountsLoaded = ref(false);

const selectedAccountKey = ref<string | null>(null);

function getColorVariable(hexColor: string | null): string | null {
    return getRGBString(hexColor);
}

function mapAccount(acc: DbAccount): KnownAccount {
    const server = universesAndAccountsStore.servers.find(s => s.id == acc.serverId && s.language == acc.serverLanguage);
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
        universeId: acc.serverId,
        universeLanguage: acc.serverLanguage,
        name: acc.name,
        universeName: serverName,
    };
}

async function loadKnownAccounts(): Promise<void> {
    const accounts = universesAndAccountsStore.accounts
        .map<KnownAccount>(acc => mapAccount(acc))
        .sort((a, b) => {
            const lang = a.universeLanguage.localeCompare(b.universeLanguage);
            if (lang != 0) {
                return lang;
            }

            if (a.universeName != null && b.universeName == null) {
                return -1;
            }
            if (a.universeName == null && b.universeName != null) {
                return 1;
            }

            const uniId = a.universeId - b.universeId;
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
        const serverKey = `${acc.universeLanguage}-${acc.universeId}`;
        (groups[serverKey] ??= []).push(acc);
    });

    const result = Object.keys(groups).sort().map(key => ({
        serverName: groups[key][0].universeName,
        accounts: groups[key],
    }));
    knownAccountGroups.value = result;
}

async function gotoAccount() {
    const accs = knownAccountGroups.value.flatMap(gr => gr.accounts);
    const account = accs.find(acc => acc.key == selectedAccountKey.value);
    if (account == null) {
        return;
    }

    const url = `/views/stats.html?player=${account.id}&language=${account.universeLanguage}&server=${account.universeId}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    emit('close');

    await nextTick();
    selectedAccountKey.value = null;
}

onMounted(async () => {
    await loadKnownAccounts();
    knownAccountsLoaded.value = true;
});
</script>

<style lang="scss" scoped>
    select {
        width: 100%;
    }
</style>
