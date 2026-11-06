<template>
    <div class="highscores">
        <LoadingSpinner v-if="dataModuleLoading" />
        <template v-else>
            <GridTable :columns="tableColumns" :items="tableItems" class="player-selection-table">
                <template #cell-player="{ value: player }">
                    <template v-if="player == null">
                        <input
                            type="text"
                            v-model="selectedPlayerName"
                            :placeholder="translations().extension.universeHistory.playerSelection.search"
                            list="player-list"
                            @change="onPlayerSelected(($event.target as HTMLInputElement).value)"
                            style="width: 100%"
                        />
                        <datalist id="player-list">
                            <option v-for="(name, i) in playerNames" :key="i">
                                {{ name }}
                            </option>
                        </datalist>
                    </template>

                    <div v-else class="list-item">
                        <span class="mdi mdi-delete" @click="removePlayer(player.id)" />
                        <span v-text="player.name" />
                    </div>
                </template>
            </GridTable>

            <Tabs :tabs="tabs">
                <template v-for="key in keys" #[`tab-content-${key}`]>
                        <span v-if="playerScoresLoading" :key="`score-${key}-loading`" class="loading" />
                        <ScrollableChart
                            v-else-if="playerIds.length > 0"
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
            </Tabs>
        </template>
    </div>
</template>

<script setup lang="ts">
import GridTable from '@stats/components/common/GridTable.vue';
import LoadingSpinner from '@stats/components/common/LoadingSpinner.vue';
import ScrollableChart from '@stats/components/common/scrollable-chart/ScrollableChart.vue';
import Tabs from '@stats/components/common/Tabs.vue';
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
import { GlobalOgameMetaData } from '@stats/data/global';
import { useServerSettingsStore } from '@stats/data/ServerSettingsDataModule';
import { useUniverseHistoryStore } from '@stats/data/UniverseHistoryDataModule';
import type { UniverseHistoryPlayer } from '@stats/data/UniverseHistoryDataModule';
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

const playerScoresLoading = ref(true);

const selectedPlayerName = ref('');

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

const tableColumns = computed<GridTableColumn<'player'>[]>(() => {
    return [{
        key: 'player',
        label: translations().extension.universeHistory.playerSelection.header,
        headerClass: 'player-selection-table-cell',
        class: 'player-selection-table-cell',
    }];
});

const tableItems = computed<{ player: UniverseHistoryPlayer | null }[]>(() => {
    return [
        { player: null },
        ...selectedPlayers.value.map(player => ({ player })),
    ];
});

const playerIds = computed<number[]>(() => {
    return (route.query.players as string | null ?? '')
        .split(',')
        .filter(id => id.length > 0)
        .map(playerId => parseIntSafe(playerId, 10))
        .filter(playerId => players.value.some(p => p.id == playerId));
});

async function redirectToDefault() {
    if (playerIds.value.length != 0) {
        return;
    }

    let defaultPlayerIds = universeSpecificSettingsStore.settings.universeHistory.players.highscore;
    if (defaultPlayerIds.length == 0) {
        defaultPlayerIds = [GlobalOgameMetaData.playerId];
    }

    await updatePlayerIdRoute(defaultPlayerIds);
}

async function loadPlayerScores() {
    playerScoresLoading.value = true;

    scoreDatasets.value = {} as Record<DbUniverseHistoryScoreType, ScrollableChartDataset[]>;

    const datasetsByPlayer: Record<number, Record<DbUniverseHistoryScoreType, ScrollableChartDataset>> = {};
    playerIds.value.forEach(p => datasetsByPlayer[p] = {} as Record<DbUniverseHistoryScoreType, ScrollableChartDataset>);

    keys.forEach(key => {
        scoreDatasets.value[key] = [];

        playerIds.value.forEach((pid, i) => datasetsByPlayer[pid][key] = {
            key: `${pid}-${key}`,
            values: [],
            color: colors[i % colors.length],
            label: players.value.find(p => p.id == pid)?.name ?? _throw(`no player with id '${pid}' found`),
            filled: false,
            stack: false,
            hidePoints: false,
        });
    });

    let minDate = Number.MAX_SAFE_INTEGER;

    const scores = await universeHistoryStore.getPlayerScoreHistory(playerIds.value);
    const types = HighscoreTypeNames;
    const lastScores = createRecord(playerIds.value, () => createRecord(types, null)) as Record<number, Record<DbUniverseHistoryScoreType, number | null>>;

    scores.forEach((score, i) => {
        minDate = Math.min(minDate, score.date);

        if (lastScores[score.playerId][score.type] == score.score) { //no duplicates if only position changed
            return;
        }
        if (!types.includes(score.type)) {
            return; // happens if beta data available
        }

        datasetsByPlayer[score.playerId][score.type].values.push({
            x: score.date,
            y: score.score,
        });
        lastScores[score.playerId][score.type] = score.score;
    });

    keys.forEach(key => {
        playerIds.value.forEach(pid => {
            scoreDatasets.value[key].push(datasetsByPlayer[pid][key]);
        });
    });

    firstDay.value = startOfDay(minDate).getTime();

    playerScoresLoading.value = false;
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

const players = computed(() => universeHistoryStore.players);

const playerNames = computed(() => {
    return players.value
        .map(player => player.name)
        .sort();
});

const selectedPlayers = computed(() => playerIds.value.map(pid => players.value.find(p => p.id == pid)!));

async function onPlayerSelected(name: string) {
    const player = players.value.find(p => p.name.toLowerCase() == name.toLowerCase());
    if (player == null) {
        return;
    }

    await nextTick();
    selectedPlayerName.value = '';

    const localPlayerIds = (route.query.players as string | null)?.split(',') ?? [];
    await updatePlayerIdRoute([
        ...localPlayerIds.filter(pid => pid != player.id.toString()),
        player.id,
    ]);
    await loadPlayerScores();
}

async function removePlayer(id: number) {
    await updatePlayerIdRoute(playerIds.value.filter(pid => pid != id));

    await loadPlayerScores();
}

function updateSettings(nextPlayerIds: number[]) {
    const settings = universeSpecificSettingsStore.settings;
    universeSpecificSettingsStore.updateSettings({
        ...settings,
        universeHistory: {
            ...settings.universeHistory,
            players: {
                ...settings.universeHistory.players,
                highscore: nextPlayerIds,
            },
        },
    });
}

async function updatePlayerIdRoute(ids: (string | number)[]) {
    updateSettings(ids.map(id => typeof id === 'string' ? parseIntSafe(id, 10) : id));

    await router.replace({
        query: {
            players: ids.join(','),
        },
    });
    await redirectToDefault();
}

onMounted(async () => {
    await universeSpecificSettingsStore.ready;
    await redirectToDefault();

    dataModuleLoading.value = true;
    await universeHistoryStore.ready;
    dataModuleLoading.value = false;

    await loadPlayerScores();
});
</script>

<style lang="scss" scoped>
    .highscores {
        display: grid;
        grid-template-columns: 200px 1fr;
        height: 100%;
    }

    .player-selection {
        margin-right: 16px;

        &-table {
            height: fit-content;
            margin-right: 16px;

            :deep(.player-selection-table-cell) {
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
