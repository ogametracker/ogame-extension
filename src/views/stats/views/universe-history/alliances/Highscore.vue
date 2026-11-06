<template>
    <div class="highscores">
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

                    <div v-else class="list-item">
                        <span class="mdi mdi-delete" @click="removeAlliance(alliance.id)" />
                        <span v-text="getAllianceString(alliance)" />
                    </div>
                </template>
            </grid-table>

            <tabs :tabs="tabs">
                <template v-for="key in keys" #[`tab-content-${key}`]>
                        <span v-if="allianceScoresLoading" :key="`score-${key}-loading`" class="loading" />
                        <scrollable-chart
                            v-else-if="allianceIds.length > 0"
                            :key="`score-${key}`"
                            :datasets="scoreDatasets[key]"
                            continue-last-value
                            show-x-values-in-grid
                            :tick-interval="1000 * 60 * 60 * 24"
                            :ticks="30"
                            :tick-list="days"
                            :min-tick="firstDay"
                            :max-tick="nextDay"
                            :x-label-formatter="(x: number) => formatDate(x, 'date')"
                            :x-label-tooltip-formatter="(x: number) => formatDate(x, 'datetime')"
                        />
                </template>
            </tabs>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { translations, formatDate } from '@stats/i18n';
import type { DbUniverseHistoryScoreType } from '@ogame-tracker/shared/db/schema/universe-history';
import { HighscoreTypeNames } from '@ogame-tracker/shared/models/ogame/highscore';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { parseIntSafe } from '@ogame-tracker/shared/utils/parseNumbers';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import type { GridTableColumn } from '@stats/components/common/GridTable.vue';
import type { ScrollableChartDataset } from '@stats/components/common/scrollable-chart/ScrollableChart.vue';
import type { Tab } from '@stats/components/common/Tabs.vue';
import { useServerSettingsStore } from '@stats/data/ServerSettingsDataModule';
import { useUniverseHistoryStore } from '@stats/data/UniverseHistoryDataModule';
import type { UniverseHistoryAlliance } from '@stats/data/UniverseHistoryDataModule';
import { useUniverseSpecificSettingsStore } from '@stats/data/UniverseSpecificSettingsDataModule';
import { addDays } from 'date-fns';
import startOfDay from 'date-fns/startOfDay';

const router = useRouter();

const route = useRoute();

const serverSettingsStore = useServerSettingsStore();

const universeSpecificSettingsStore = useUniverseSpecificSettingsStore();

const universeHistoryStore = useUniverseHistoryStore();

const colors = [
    '#F48FB1', // pink lighten-3
    '#673AB7', // deep-purple
    '#E53935', // red darken-1
    '#3F51B5', // indigo
    '#006064', // cyan darken-4
    '#546E7A', // blue-grey darken-1
    '#EF9A9A', // red lighten-3
    '#64B5F6', // blue lighten-2
    '#FFE082', // amber lighten-3
    '#E91E63', // pink
    '#BA68C8', // purple lighten-2
    '#BF360C', // deep-orange darken-4
    '#039BE5', // light-blue darken-1
    '#8E24AA', // purple darken-1
    '#9CCC65', // light-green lighten-1
    '#A1887F', // brown lighten-2
    '#0097A7', // cyan darken-2
    '#FFAB91', // deep-orange lighten-3
    '#009688', // teal
    '#43A047', // green darken-1
    '#1A237E', // indigo darken-4
    '#558B2F', // light-green darken-3
    '#311B92', // deep-purple darken-4
    '#880E4F', // pink darken-4
    '#01579B', // light-blue darken-4
    '#AFB42B', // lime darken-2
    '#1E88E5', // blue darken-1
    '#827717', // lime darken-4
    '#FFF176', // yellow lighten-2
    '#BDBDBD', // grey lighten-1
    '#FFC107', // amber
    '#FFA726', // orange lighten-1
    '#FF5722', // deep-orange
    '#795548', // brown
    '#004D40', // teal darken-4
    '#81C784', // green lighten-2
    '#90A4AE', // blue-grey lighten-2
    '#757575', // grey darken-1
    '#FDD835', // yellow darken-1
];

const leftX = ref(0);

const rightX = ref(1);

const dataModuleLoading = ref(true);

const allianceScoresLoading = ref(true);

const selectedAllianceName = ref('');

const scoreDatasets = ref({} as Record<DbUniverseHistoryScoreType, ScrollableChartDataset[]>);

const firstDay = ref(0);

const keys = HighscoreTypeNames;

const tabs = computed<(Tab & { key: DbUniverseHistoryScoreType })[]>(() => {
    const localTabs: (Tab & { key: DbUniverseHistoryScoreType })[] = [
        {
            key: 'total',
            label: translations().extension.universeHistory.highscoreTabs.total,
        },
        {
            key: 'economy',
            label: translations().extension.universeHistory.highscoreTabs.economy,
        },
        {
            key: 'research',
            label: translations().extension.universeHistory.highscoreTabs.research,
        },
        {
            key: 'military',
            label: translations().extension.universeHistory.highscoreTabs.military,
        },
        {
            key: 'militaryBuilt',
            label: translations().extension.universeHistory.highscoreTabs.militaryBuilt,
        },
        {
            key: 'militaryDestroyed',
            label: translations().extension.universeHistory.highscoreTabs.militaryDestroyed,
        },
        {
            key: 'militaryLost',
            label: translations().extension.universeHistory.highscoreTabs.militaryLost,
        },
        {
            key: 'honor',
            label: translations().extension.universeHistory.highscoreTabs.honor,
        },
        {
            key: 'numberOfShips',
            label: translations().extension.universeHistory.highscoreTabs.numberOfShips,
        },
    ];

    if (serverSettingsStore.serverSettings.lifeforms.enabled) {
        localTabs.push(
            {
                key: 'lifeform',
                label: translations().extension.universeHistory.highscoreTabs.lifeform,
            },
            {
                key: 'lifeformEconomy',
                label: translations().extension.universeHistory.highscoreTabs.lifeformEconomy,
            },
            {
                key: 'lifeformTechnology',
                label: translations().extension.universeHistory.highscoreTabs.lifeformTechnology,
            },
            {
                key: 'lifeformDiscoveries',
                label: translations().extension.universeHistory.highscoreTabs.lifeformDiscoveries,
            }
        );
    }

    return localTabs;
});

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
        ...selectedAlliances.value.map(alliance => ({ alliance })),
    ];
});

const allianceIds = computed<number[]>(() => {
    return (route.query.alliances as string | null ?? '')
        .split(',')
        .filter(id => id.length > 0)
        .map(allianceId => parseIntSafe(allianceId, 10));
});

async function redirectToDefault() {
    if (allianceIds.value.length != 0) {
        return;
    }

    const defaultIds = universeSpecificSettingsStore.settings.universeHistory.alliances.highscore;
    if (defaultIds.length != 0) {
        await updateAllianceIdRoute(defaultIds);
    }
}

async function loadAllianceScores() {
    allianceScoresLoading.value = true;

    scoreDatasets.value = {} as Record<DbUniverseHistoryScoreType, ScrollableChartDataset[]>;

    const datasetsByAlliance: Record<number, Record<DbUniverseHistoryScoreType, ScrollableChartDataset>> = {};
    allianceIds.value.forEach(p => datasetsByAlliance[p] = {} as Record<DbUniverseHistoryScoreType, ScrollableChartDataset>);

    keys.forEach(key => {
        scoreDatasets.value[key] = [];

        allianceIds.value.forEach((pid, i) => datasetsByAlliance[pid][key] = {
            key: `${pid}-${key}`,
            values: [],
            color: colors[i % colors.length],
            label: getAllianceString(alliances.value.find(p => p.id == pid) ?? _throw(`no alliance with id '${pid}' found`)),
            filled: false,
            stack: false,
            hidePoints: false,
        });
    });

    let minDate = Number.MAX_SAFE_INTEGER;

    const scores = await universeHistoryStore.getAllianceScoreHistory(allianceIds.value);
    const types = HighscoreTypeNames;
    const lastScores = createRecord(allianceIds.value, () => createRecord(types, null)) as Record<number, Record<DbUniverseHistoryScoreType, number | null>>;

    scores.forEach((score, i) => {
        minDate = Math.min(minDate, score.date);

        if (lastScores[score.allianceId][score.type] == score.score) { //no duplicates if only position changed
            return;
        }
        if (!types.includes(score.type)) {
            return; // happens if beta data available
        }

        datasetsByAlliance[score.allianceId][score.type].values.push({
            x: score.date,
            y: score.score,
        });
        lastScores[score.allianceId][score.type] = score.score;
    });

    keys.forEach(key => {
        allianceIds.value.forEach(pid => {
            scoreDatasets.value[key].push(datasetsByAlliance[pid][key]);
        });
    });

    firstDay.value = startOfDay(minDate).getTime();

    allianceScoresLoading.value = false;
}

const nextDay = computed(() => addDays(startOfDay(Date.now()), 1).getTime());

const days = computed(() => {
    const localDays: number[] = [];

    const maxDay = nextDay.value;
    for (let day = firstDay.value;day <= maxDay;day = addDays(day, 1).getTime()) {
        localDays.push(day);
    }

    return localDays;
});

const alliances = computed(() => universeHistoryStore.alliances);

function getAllianceString(ally: UniverseHistoryAlliance) {
    return `[${ally.tag}] ${ally.name}`;
}

const allianceNames = computed(() => {
    return alliances.value
        .map(alliance => getAllianceString(alliance))
        .sort();
});

const selectedAlliances = computed(() => allianceIds.value.map(pid => alliances.value.find(p => p.id == pid)!));

async function onAllianceSelected(name: string) {
    const alliance = alliances.value.find(a => getAllianceString(a).toLowerCase() == name.toLowerCase());
    if (alliance == null) {
        return;
    }

    await nextTick();
    selectedAllianceName.value = '';

    const localAllianceIds = (route.query.alliances as string | null)?.split(',') ?? [];
    await updateAllianceIdRoute([
        ...localAllianceIds.filter(pid => pid != alliance.id.toString()),
        alliance.id,
    ]);
    await loadAllianceScores();
}

async function removeAlliance(id: number) {
    await updateAllianceIdRoute(allianceIds.value.filter(pid => pid != id));

    await loadAllianceScores();
}

function updateSettings(allyIds: number[]) {
    const settings = universeSpecificSettingsStore.settings;
    universeSpecificSettingsStore.updateSettings({
        ...settings,
        universeHistory: {
            ...settings.universeHistory,
            alliances: {
                ...settings.universeHistory.alliances,
                highscore: allyIds,
            },
        },
    });
}

async function updateAllianceIdRoute(ids: (string | number)[]) {
    updateSettings(ids.map(id => typeof id === 'string' ? parseIntSafe(id, 10) : id));

    await router.replace({
        query: {
            alliances: ids.join(','),
        },
    });
}

onMounted(async () => {
    await universeSpecificSettingsStore.ready;
    await redirectToDefault();

    dataModuleLoading.value = true;
    await universeHistoryStore.ready;
    dataModuleLoading.value = false;

    await loadAllianceScores();
});
</script>

<style lang="scss" scoped>
    .highscores {
        display: grid;
        grid-template-columns: 200px 1fr;
        height: 100%;
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

    .list {
        display: flex;
        flex-direction: column;

        &-item {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 12px;
            align-items: center;

            .mdi {
                transform: scale(1.5);
                cursor: pointer;
            }
        }
    }
</style>
