<template>
    <div class="history" v-if="historyTrackingEnabled">
        <loading-spinner v-if="dataModuleLoading" />
        <template v-else>
            <grid-table :columns="tableColumns" :items="tableItems" class="alliance-selection-table">
                <template #cell-alliance="{ value: alliance }">
                    <template v-if="alliance == null">
                        <input
                            type="text"
                            v-model="selectedAllianceName"
                            :placeholder="translations().extension.universeHistory.allianceSelection.search"
                            list="alliance-list"
                            @change="onAllianceSelected(($event.target as HTMLInputElement).value)"
                            style="width: 100%"
                        />
                        <datalist id="alliance-list">
                            <option v-for="(name, i) in allianceNames" :key="i">
                                {{ name }}
                            </option>
                        </datalist>
                    </template>

                    <div class="list-item" v-else>
                        <span v-text="`[${alliance.tag}] ${alliance.name}`" />
                    </div>
                </template>
            </grid-table>

            <tabs :tabs="tabs">
                <template #tab-content-tag>
                    <alliance-tag-history-table v-if="allianceId != null" :allianceId="allianceId" />
                </template>

                <template #tab-content-name>
                    <alliance-name-history-table v-if="allianceId != null" :allianceId="allianceId" />
                </template>

                <template #tab-content-members>
                    <alliance-member-history-table v-if="allianceId != null" :allianceId="allianceId" />
                </template>
            </tabs>
        </template>
    </div>
    <universe-history-tracking-settings v-else />
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { translations } from '@stats/i18n';
import { parseIntSafe } from '@ogame-tracker/shared/utils/parseNumbers';
import type { GridTableColumn } from '@stats/components/common/GridTable.vue';
import type { Tab } from '@stats/components/common/Tabs.vue';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import { useUniverseHistoryStore } from '@stats/data/UniverseHistoryDataModule';
import type { UniverseHistoryAlliance } from '@stats/data/UniverseHistoryDataModule';
import UniverseHistoryTrackingSettings from '@stats/components/settings/UniverseHistoryTrackingSettings.vue';
import AllianceTagHistoryTable from '@stats/components/universe-history/AllianceTagHistoryTable.vue';
import AllianceNameHistoryTable from '@stats/components/universe-history/AllianceNameHistoryTable.vue';
import AllianceMemberHistoryTable from '@stats/components/universe-history/AllianceMemberHistoryTable.vue';
import { useUniverseSpecificSettingsStore } from '@stats/data/UniverseSpecificSettingsDataModule';

const router = useRouter();

const route = useRoute();

const settingsStore = useSettingsStore();

const universeHistoryStore = useUniverseHistoryStore();

const universeSpecificSettingsStore = useUniverseSpecificSettingsStore();

const historyTrackingEnabled = computed(() => settingsStore.settings.universeHistory.trackHistory);

const tableColumns = computed<GridTableColumn<'alliance'>[]>(() => {
    return [{
        key: 'alliance',
        label: translations().extension.universeHistory.allianceSelection.header,
        headerClass: 'alliance-selection-table-cell',
        class: 'alliance-selection-table-cell',
    }];
});

const tableItems = computed<{ alliance: UniverseHistoryAlliance | null }[]>(() => {
    return [
        { alliance: null },
        { alliance: selectedAlliance.value },
    ].filter((value, i, array) => array.findIndex(v => v.alliance == value.alliance) == i);
});

const tabs = computed<Tab[]>(() => {
    return [
        {
            key: 'tag',
            label: translations().extension.universeHistory.historyTabs.tags,
        },
        {
            key: 'name',
            label: translations().extension.universeHistory.historyTabs.names,
        },
        {
            key: 'members',
            label: translations().extension.universeHistory.historyTabs.members,
        },
    ];
});

const selectedAlliance = computed(() => universeHistoryStore.alliances.find(p => p.id == allianceId.value) ?? null);

const allianceId = computed<number | null>(() => {
    try {
        const localAllianceId = parseIntSafe(route.query.alliance as string | null ?? '', 10);
        return localAllianceId;
    } catch {
        return null;
    }
});

const dataModuleLoading = ref(true);

const selectedAllianceName = ref('');

async function redirectToDefault() {
    if (allianceId.value != null) {
        return;
    }

    const defaultAllianceId = universeSpecificSettingsStore.settings.universeHistory.alliances.history;
    if (defaultAllianceId != null) {
        await updateAllianceIdRoute(defaultAllianceId);
    }
}

function updateSettings(nextAllianceId: number) {
    const settings = universeSpecificSettingsStore.settings;
    universeSpecificSettingsStore.updateSettings({
        ...settings,
        universeHistory: {
            ...settings.universeHistory,
            alliances: {
                ...settings.universeHistory.alliances,
                history: nextAllianceId,
            },
        },
    });
}

async function updateAllianceIdRoute(id: number) {
    updateSettings(id);

    await router.replace({
        query: {
            alliance: id.toString(),
        },
    });
    await redirectToDefault();
}

const allianceNames = computed(() => {
    return universeHistoryStore.alliances
        .map(alliance => getAllyString(alliance))
        .sort();
});

function getAllyString(alliance: UniverseHistoryAlliance) {
    return `[${alliance.tag}] ${alliance.name}`;
}

async function onAllianceSelected(name: string) {
    const alliance = universeHistoryStore.alliances.find(p => getAllyString(p).toLowerCase() == name.toLowerCase());
    if (alliance == null) {
        return;
    }

    await nextTick();
    selectedAllianceName.value = '';

    await updateAllianceIdRoute(alliance.id);
}

onMounted(async () => {
    await universeSpecificSettingsStore.ready;
    await redirectToDefault();

    dataModuleLoading.value = true;
    await universeHistoryStore.ready;
    dataModuleLoading.value = false;
});
</script>

<style lang="scss" scoped>
    .history {
        display: grid;
        grid-template-columns: 200px 1fr;
        height: 100%;
    }

    .list {
        display: flex;
        flex-direction: column;
    }

    .alliance-selection {
        margin-right: 16px;

        &-table {
            height: fit-content;
            margin-right: 16px;

            :deep(.alliance-selection-table-cell) {
                text-align: left;
                justify-content: start;
                border-bottom: 1px solid rgba(var(--color), 0.5);
            }
        }
    }

    .date-range {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 4px;
    }
</style>
