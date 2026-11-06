<template>
    <div class="history" v-if="historyTrackingEnabled">
        <loading-spinner v-if="dataModuleLoading" />
        <template v-else>
            <grid-table :columns="tableColumns" :items="tableItems" class="player-selection-table">
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
                        <span v-text="player.name" />
                    </div>
                </template>
            </grid-table>

            <tabs :tabs="tabs">
                <template #tab-content-status>
                    <status-history-chart v-if="playerId != null" :playerId="playerId" />
                </template>

                <template #tab-content-nickname>
                    <player-name-history-table v-if="playerId != null" :playerId="playerId" />
                </template>

                <template #tab-content-alliance>
                    <player-alliance-history-table v-if="playerId != null" :playerId="playerId" />
                </template>

                <template #tab-content-planet-moons>
                    <player-planets-and-moons-history v-if="playerId != null" :playerId="playerId" />
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
import { GlobalOgameMetaData } from '@stats/data/global';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import { useUniverseHistoryStore } from '@stats/data/UniverseHistoryDataModule';
import type { UniverseHistoryPlayer } from '@stats/data/UniverseHistoryDataModule';
import UniverseHistoryTrackingSettings from '@stats/components/settings/UniverseHistoryTrackingSettings.vue';
import StatusHistoryChart from '@stats/components/universe-history/StatusHistoryChart.vue';
import PlayerNameHistoryTable from '@stats/components/universe-history/PlayerNameHistoryTable.vue';
import PlayerAllianceHistoryTable from '@stats/components/universe-history/PlayerAllianceHistoryTable.vue';
import PlayerPlanetsAndMoonsHistory from '@stats/components/universe-history/PlayerPlanetsAndMoonsHistory.vue';
import { useUniverseSpecificSettingsStore } from '@stats/data/UniverseSpecificSettingsDataModule';

const router = useRouter();

const route = useRoute();

const settingsStore = useSettingsStore();

const universeHistoryStore = useUniverseHistoryStore();

const universeSpecificSettingsStore = useUniverseSpecificSettingsStore();

const historyTrackingEnabled = computed(() => settingsStore.settings.universeHistory.trackHistory);

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
        { player: selectedPlayer.value },
    ].filter((value, i, array) => array.findIndex(v => v.player == value.player) == i);
});

const tabs = computed<Tab[]>(() => {
    return [
        {
            key: 'status',
            label: translations().extension.universeHistory.historyTabs.status,
        },
        {
            key: 'nickname',
            label: translations().extension.universeHistory.historyTabs.nicknames,
        },
        {
            key: 'alliance',
            label: translations().extension.universeHistory.historyTabs.alliances,
        },
        {
            key: 'planet-moons',
            label: translations().extension.universeHistory.historyTabs.planetAndMoons,
        },
    ];
});

const selectedPlayer = computed(() => universeHistoryStore.players.find(p => p.id == playerId.value) ?? null);

const playerId = computed<number | null>(() => {
    try {
        const localPlayerId = parseIntSafe(route.query.player as string | null ?? '', 10);
        return localPlayerId;
    } catch {
        return null;
    }
});

const dataModuleLoading = ref(true);

const selectedPlayerName = ref('');

async function redirectToDefault() {
    if (playerId.value != null) {
        return;
    }

    const defaultPlayerId = universeSpecificSettingsStore.settings.universeHistory.players.history
        ?? GlobalOgameMetaData.playerId;

    await updatePlayerIdRoute(defaultPlayerId);
}

function updateSettings(nextPlayerId: number) {
    const settings = universeSpecificSettingsStore.settings;
    universeSpecificSettingsStore.updateSettings({
        ...settings,
        universeHistory: {
            ...settings.universeHistory,
            players: {
                ...settings.universeHistory.players,
                history: nextPlayerId,
            },
        },
    });
}

async function updatePlayerIdRoute(id: number) {
    updateSettings(id);

    await router.replace({
        query: {
            player: id.toString(),
        },
    });
    await redirectToDefault();
}

const playerNames = computed(() => {
    return universeHistoryStore.players
        .map(player => player.name)
        .sort();
});

async function onPlayerSelected(name: string) {
    const player = universeHistoryStore.players.find(p => p.name.toLowerCase() == name.toLowerCase());
    if (player == null) {
        return;
    }

    await nextTick();
    selectedPlayerName.value = '';

    await updatePlayerIdRoute(player.id);
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

    .date-range {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 4px;
    }
</style>
