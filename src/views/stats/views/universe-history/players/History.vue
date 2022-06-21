<template>
    <div class="history">
        <span v-if="dataModuleLoading">LOCA: Loading</span>
        <template v-else>
            <grid-table
                :columns="tableColumns"
                :items="tableItems"
                class="player-selection-table"
            >
                <template #cell-player="{ value: player }">
                    <template v-if="player == null">
                        <input
                            type="text"
                            v-model="selectedPlayerName"
                            placeholder="LOCA: Player search here"
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
                    TODO: Status History Graph
                </template>

                <template #tab-content-nickname>
                    <grid-table
                        :columns="nameHistoryColumns"
                        :items="nameHistoryItems"
                        inline
                    >
                        <template #cell-start="{ value }">
                            <span
                                v-if="value != null"
                                v-text="$i18n.$d(value, 'date')"
                            />
                            <span v-else v-text="'?'" />
                        </template>

                        <template #cell-->-</template>

                        <template #cell-end="{ value }">
                            <span
                                v-if="value != null"
                                v-text="$i18n.$d(value, 'date')"
                            />
                            <span v-else v-text="'LOCA: heute'" />
                        </template>
                    </grid-table>
                </template>

                <template #tab-content-alliance>
                    <grid-table
                        :columns="allianceHistoryColumns"
                        :items="allianceHistoryItems"
                        inline
                    >
                        <template #cell-alliance="{ value }">
                            <span
                                v-if="value != null"
                                v-text="`[${value.tag}] ${value.name}`"
                            />
                            <span v-else v-text="'LOCA: no alliance'" />
                        </template>

                        <template #cell-start="{ value }">
                            <span
                                v-if="value != null"
                                v-text="$i18n.$d(value, 'date')"
                            />
                            <span v-else v-text="'?'" />
                        </template>

                        <template #cell-->-</template>

                        <template #cell-end="{ value }">
                            <span
                                v-if="value != null"
                                v-text="$i18n.$d(value, 'date')"
                            />
                            <span v-else v-text="'LOCA: heute'" />
                        </template>
                    </grid-table>
                </template>

                <template #tab-content-planet-moons>
                    TODO: History of planets and moons
                </template>
            </tabs>
        </template>
    </div>
</template>

<script lang="ts">
    import { OgameTrackerUniverseHistoryPlayerAlliance, OgameTrackerUniverseHistoryPlayerName, OgameTrackerUniverseHistoryPlayerState } from '@/shared/db/schema/universe-history';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { Tab } from '@/views/stats/components/common/Tabs.vue';
    import { GlobalOgameMetaData } from '@/views/stats/data/global';
    import { UniverseHistoryDataModule, UniverseHistoryPlayer } from '@/views/stats/data/UniverseHistoryDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    interface NameHistoryItem {
        name: string;
        start: number | null;
        end: number | null;
    }
    interface AllianceHistoryItem {
        alliance: { name: string; tag: string } | null;
        start: number | null;
        end: number | null;
    }

    @Component({})
    export default class Players extends Vue {

        private get tableColumns(): GridTableColumn<'player'>[] {
            return [{
                key: 'player',
                label: 'LOCA: Player selection',
                headerClass: 'player-selection-table-cell',
                class: 'player-selection-table-cell',
            }];
        }

        private get tableItems(): { player: UniverseHistoryPlayer | null }[] {
            return [
                { player: null },
                { player: this.selectedPlayer },
            ];
        }

        private get tabs(): Tab[] {
            return [
                {
                    key: 'status',
                    label: 'LOCA: Status',
                },
                {
                    key: 'nickname',
                    label: 'LOCA: Nicknames',
                },
                {
                    key: 'alliance',
                    label: 'LOCA: Alliances',
                },
                {
                    key: 'planet-moons',
                    label: 'LOCA: Planet & Moons',
                },
            ];
        }

        private get selectedPlayer() {
            return UniverseHistoryDataModule.players.find(p => p.id == this.playerId)!;
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
        private loading = true;
        private selectedPlayerName = '';
        private stateHistory: OgameTrackerUniverseHistoryPlayerState[] = [];
        private nameHistory: OgameTrackerUniverseHistoryPlayerName[] = [];
        private allianceHistory: OgameTrackerUniverseHistoryPlayerAlliance[] = [];

        private get nameHistoryColumns(): GridTableColumn<keyof NameHistoryItem | '-'>[] {
            return [
                {
                    key: 'name',
                    label: 'LOCA: Name',
                },
                {
                    key: 'start',
                    label: 'LOCA: From',
                },
                {
                    key: '-',
                },
                {
                    key: 'end',
                    label: 'LOCA: Until',
                },
            ];
        }

        private get nameHistoryItems(): NameHistoryItem[] {
            return this.nameHistory.map<NameHistoryItem>((item, i, history) => {
                const start = i == 0 ? null : item.date;
                const end = history[i + 1]?.date ?? null;

                return {
                    name: item.name,
                    start,
                    end,
                };
            }).reverse();
        }

        private get allianceHistoryColumns(): GridTableColumn<keyof AllianceHistoryItem | '-'>[] {
            return [
                {
                    key: 'alliance',
                    label: 'LOCA: Alliance',
                },
                {
                    key: 'start',
                    label: 'LOCA: From',
                },
                {
                    key: '-',
                },
                {
                    key: 'end',
                    label: 'LOCA: Until',
                },
            ];
        }

        private get allianceHistoryItems(): AllianceHistoryItem[] {
            return this.allianceHistory.map<AllianceHistoryItem>((item, i, history) => {
                const start = i == 0 ? null : item.date;
                const end = history[i + 1]?.date ?? null;

                return {
                    alliance: UniverseHistoryDataModule.alliances.find(a => a.id == item.allianceId) ?? null,
                    start,
                    end,
                };
            }).reverse();
        }

        private async mounted() {
            await this.redirectToMeIfNoPlayersSelected();

            this.dataModuleLoading = true;
            await UniverseHistoryDataModule.ready;
            this.dataModuleLoading = false;

            await this.loadPlayerHistory();
        }

        private async redirectToMeIfNoPlayersSelected() {
            if (this.playerId == null) {
                await this.$router.replace({
                    name: 'universe-history/players/history',
                    query: {
                        player: GlobalOgameMetaData.playerId.toString(),
                    },
                });
            }
        }

        private async updatePlayerIdRoute(id: number) {
            await this.$router.replace({
                query: {
                    player: id.toString(),
                },
            });
            await this.redirectToMeIfNoPlayersSelected();
        }

        private async loadPlayerHistory() {
            if (this.playerId == null) {
                return;
            }

            this.loading = true;

            this.stateHistory = await UniverseHistoryDataModule.getPlayerStateHistory(this.playerId);
            this.nameHistory = await UniverseHistoryDataModule.getPlayerNameHistory(this.playerId);
            this.allianceHistory = await UniverseHistoryDataModule.getPlayerAllianceHistory(this.playerId);

            this.loading = false;
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
            await this.loadPlayerHistory();
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