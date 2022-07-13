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
                            :placeholder="$i18n.$t.universeHistory.playerSelection.search"
                            list="player-list"
                            @change="onPlayerSelected($event.target.value)"
                            style="width: 100%"
                        />
                        <datalist id="player-list">
                            <option v-for="name in playerNames" :key="name">
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

<script lang="ts">
    import { OgameTrackerUniverseHistoryPlayerAlliance, OgameTrackerUniverseHistoryPlayerName, OgameTrackerUniverseHistoryPlayerState } from '@/shared/db/schema/universe-history';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { Tab } from '@/views/stats/components/common/Tabs.vue';
    import { GlobalOgameMetaData } from '@/views/stats/data/global';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { UniverseHistoryDataModule, UniverseHistoryPlayer } from '@/views/stats/data/UniverseHistoryDataModule';
    import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
    import UniverseHistoryTrackingSettings from '@stats/components/settings/UniverseHistoryTrackingSettings.vue';
    import StatusHistoryChart from '@stats/components/universe-history/StatusHistoryChart.vue';
    import PlayerNameHistoryTable from '@stats/components/universe-history/PlayerNameHistoryTable.vue';
    import PlayerAllianceHistoryTable from '@stats/components/universe-history/PlayerAllianceHistoryTable.vue';
    import PlayerPlanetsAndMoonsHistory from '@stats/components/universe-history/PlayerPlanetsAndMoonsHistory.vue';
    import { UniverseSpecificSettingsDataModule } from '@/views/stats/data/UniverseSpecificSettingsDataModule';

    @Component({
        components: {
            UniverseHistoryTrackingSettings,
            StatusHistoryChart,
            PlayerNameHistoryTable,
            PlayerAllianceHistoryTable,
            PlayerPlanetsAndMoonsHistory,
        },
    })
    export default class History extends Vue {

        private get historyTrackingEnabled() {
            return SettingsDataModule.settings.universeHistory.trackHistory;
        }

        private get tableColumns(): GridTableColumn<'player'>[] {
            return [{
                key: 'player',
                label: this.$i18n.$t.universeHistory.playerSelection.header,
                headerClass: 'player-selection-table-cell',
                class: 'player-selection-table-cell',
            }];
        }

        private get tableItems(): { player: UniverseHistoryPlayer | null }[] {
            return [
                { player: null },
                { player: this.selectedPlayer },
            ].filter((value, i, array) => array.findIndex(v => v.player == value.player) == i);
        }

        private get tabs(): Tab[] {
            return [
                {
                    key: 'status',
                    label: this.$i18n.$t.universeHistory.historyTabs.status,
                },
                {
                    key: 'nickname',
                    label: this.$i18n.$t.universeHistory.historyTabs.nicknames,
                },
                {
                    key: 'alliance',
                    label: this.$i18n.$t.universeHistory.historyTabs.alliances,
                },
                {
                    key: 'planet-moons',
                    label: this.$i18n.$t.universeHistory.historyTabs.planetAndMoons,
                },
            ];
        }

        private get selectedPlayer() {
            return UniverseHistoryDataModule.players.find(p => p.id == this.playerId) ?? null;
        }

        private get playerId(): number | null {
            try {
                const playerId = parseIntSafe(this.$route.query.player as string | null ?? '', 10);
                return playerId;
            } catch {
                return null;
            }
        }

        private dataModuleLoading = true;
        private selectedPlayerName = '';

        private async mounted() {
            await UniverseSpecificSettingsDataModule.ready;
            await this.redirectToDefault();

            this.dataModuleLoading = true;
            await UniverseHistoryDataModule.ready;
            this.dataModuleLoading = false;
        }

        private async redirectToDefault() {
            if (this.playerId != null) {
                return;
            }

            const defaultPlayerId = UniverseSpecificSettingsDataModule.settings.universeHistory.players.history
                ?? GlobalOgameMetaData.playerId;

            await this.updatePlayerIdRoute(defaultPlayerId);
        }

        private updateSettings(playerId: number) {
            const settings = UniverseSpecificSettingsDataModule.settings;
            UniverseSpecificSettingsDataModule.updateSettings({
                ...settings,
                universeHistory: {
                    ...settings.universeHistory,
                    players: {
                        ...settings.universeHistory.players,
                        history: playerId,
                    },
                },
            });
        }

        private async updatePlayerIdRoute(id: number) {
            this.updateSettings(id);

            await this.$router.replace({
                query: {
                    player: id.toString(),
                },
            });
            await this.redirectToDefault();
        }

        private get playerNames() {
            return UniverseHistoryDataModule.players
                .map(player => player.name)
                .sort();
        }

        private async onPlayerSelected(name: string) {
            const player = UniverseHistoryDataModule.players.find(p => p.name.toLowerCase() == name.toLowerCase());
            if (player == null) {
                return;
            }

            await this.$nextTick();
            this.selectedPlayerName = '';

            await this.updatePlayerIdRoute(player.id);
        }
    }
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

            &::v-deep {
                .player-selection-table-cell {
                    text-align: left;
                    justify-content: start;
                    border-bottom: 1px solid rgba(var(--color), 0.5);
                }
            }
        }
    }

    .date-range {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 4px;
    }
</style>