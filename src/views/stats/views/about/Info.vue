<template>
    <div>
        <div class="version">Version: {{ version }}</div>
        <hr />

        <h3 v-text="translations().extension.about.info.table.currentAccount.header" />
        <loading-spinner v-if="loading" />
        <grid-table
            v-else
            :items="itemsCurrentAccount"
            :columns="columns"
            class="info-table"
            no-header
            style="width: 400px"
        />
        <hr />

        <h3 v-text="translations().extension.about.info.table.global.header" />
        <loading-spinner v-if="loading" />
        <grid-table
            v-else
            :items="itemsGlobal"
            :columns="columns"
            class="info-table"
            no-header
            style="width: 400px"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { translations, formatNumber, formatDate } from '@stats/i18n';
import type { GridTableColumn } from '../../components/common/GridTable.vue';
import { useCombatReportStore } from '../../data/CombatReportDataModule';
import { useDebrisFieldReportStore } from '../../data/DebrisFieldReportDataModule';
import { useExpeditionStore } from '../../data/ExpeditionDataModule';
import { useLifeformDiscoveryStore } from '../../data/LifeformDiscoveryDataModule';
import { useServerSettingsStore } from '../../data/ServerSettingsDataModule';
import { useUniverseHistoryStore } from '../../data/UniverseHistoryDataModule';
import { useUniversesAndAccountsStore } from '../../data/UniversesAndAccountsDataModule';

interface InfoItem {
    label: string;
    value: string;
}

const expeditionStore = useExpeditionStore();

const combatReportStore = useCombatReportStore();

const debrisFieldReportStore = useDebrisFieldReportStore();

const lifeformDiscoveryStore = useLifeformDiscoveryStore();

const universesAndAccountsStore = useUniversesAndAccountsStore();

const serverSettingsStore = useServerSettingsStore();

const universeHistoryStore = useUniverseHistoryStore();

const version = computed(() => chrome.runtime.getManifest().version);

const currentAccountExpeditions = computed(() => expeditionStore.count);

const currentAccountCombats = computed(() => combatReportStore.count);

const currentAccountDfReports = computed(() => debrisFieldReportStore.count);

const currentAccountLfDiscoveries = computed(() => lifeformDiscoveryStore.count);

const trackedAccounts = computed(() => universesAndAccountsStore.accounts.length);

const lastServerSettingsUpdate = computed(() => serverSettingsStore.lastUpdate);

const universeHistoryEntries = ref(0);

const totalBytesInUse = ref(0);

const loading = ref(true);

const itemsCurrentAccount = computed<InfoItem[]>(() => {
    return [
        {
            label: translations().extension.about.info.table.currentAccount.numberOfTrackedExpeditions,
            value: formatNumber(currentAccountExpeditions.value),
        },
        {
            label: translations().extension.about.info.table.currentAccount.numberOfTrackedCombatReports,
            value: formatNumber(currentAccountCombats.value),
        },
        {
            label: translations().extension.about.info.table.currentAccount.numberOfTrackedDebrisFieldReports,
            value: formatNumber(currentAccountDfReports.value),
        },
        {
            label: translations().extension.about.info.table.currentAccount.numberOfTrackedLifeformDiscoveries,
            value: formatNumber(currentAccountLfDiscoveries.value),
        },
        {
            label: translations().extension.about.info.table.currentAccount.lastUpdateServerSettings,
            value: lastServerSettingsUpdate.value == null ? '-' : formatDate(lastServerSettingsUpdate.value, 'date'),
        },
        {
            label: translations().extension.about.info.table.currentAccount.numberOfUniverseHistoryEntries,
            value: formatNumber(universeHistoryEntries.value),
        },
    ];
});

const itemsGlobal = computed<InfoItem[]>(() => {
    return [
        {
            label: translations().extension.about.info.table.global.numberOfTrackedAccounts,
            value: formatNumber(trackedAccounts.value),
        },
        {
            label: translations().extension.about.info.table.global.estimatedSize,
            value: formatBytes(totalBytesInUse.value),
        },
    ];
});

const columns = computed<GridTableColumn<keyof InfoItem>[]>(() => {
    return [
        {
            key: 'label',
            label: '',
        },
        {
            key: 'value',
            label: '',
        },
    ];
});

function formatBytes(bytes: number): string {
    const units = ['B', 'kB', 'MB', 'GB'];
    let unitIndex = 0;
    const div = 1_000;

    while (bytes > div && units.length > unitIndex + 1) {
        bytes /= div;
        unitIndex++;
    }

    return `${formatNumber(bytes, { maximumFractionDigits: 1 })} ${units[unitIndex]}`;
}

onMounted(async () => {
    universeHistoryEntries.value = await universeHistoryStore.getNumberOfTotalEntries();
    totalBytesInUse.value = (await navigator.storage.estimate()).usage ?? 0;
    loading.value = false;
});
</script>

<style lang="scss" scoped>
    .info-table {
        width: fit-content;
    }

    .version {
        font-weight: bold;
        width: fit-content;
        background-color: black;
        background-image: linear-gradient(
            0deg,
            rgba(var(--color), 0.5),
            rgba(var(--color), 0.7)
        );
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        box-shadow: 0 0 6px 0 rgb(0 0 0 / 33%);
        padding: 8px 16px;
    }
</style>
