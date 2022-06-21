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
                    <div class="status-history-grid">
                        <div class="y-ticks">
                            <span
                                v-for="(label, i) in statusHistoryLabels"
                                :key="`status-label-${i}`"
                                v-text="label"
                            />
                        </div>

                        <div class="graph">
                            <div
                                :style="{ width: `${statusHistoryWidth}%` }"
                                style="height: 1px"
                            />
                            <div
                                v-for="(_, i) in statusHistoryLabels"
                                :key="`status-label-${i}.2`"
                                class="y-tick"
                                :style="`--y-tick: ${i}`"
                            />

                            <div
                                v-for="(item, i) in statusHistoryItems"
                                :key="`status-item-${i}`"
                                :style="{
                                    left: `${100 * item.start}%`,
                                    width: `${100 * (item.end - item.start)}%`,
                                }"
                                class="bar"
                                :class="item.class"
                            />
                        </div>

                        <div class="x-ticks">
                            <div
                                :style="{ width: `${statusHistoryWidth}%` }"
                                style="height: 1px"
                            />
                        </div>
                    </div>
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
    import { DbUniverseHistoryPlayerStateItem, OgameTrackerUniverseHistoryPlayerAlliance, OgameTrackerUniverseHistoryPlayerName, OgameTrackerUniverseHistoryPlayerState } from '@/shared/db/schema/universe-history';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { Tab } from '@/views/stats/components/common/Tabs.vue';
    import { GlobalOgameMetaData } from '@/views/stats/data/global';
    import { UniverseHistoryDataModule, UniverseHistoryPlayer } from '@/views/stats/data/UniverseHistoryDataModule';
    import subDays from 'date-fns/subDays';
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
    interface StatusHistoryItem {
        status: string | null;
        start: number;
        end: number;
        class: StatusHistoryItemClass;
    }
    type StatusHistoryItemClass = 'active' | DbUniverseHistoryPlayerStateItem | 'deleted';

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


        private readonly statusHistoryTicks = 30;

        private get statusHistoryStartDate(): Date {
            const nowMinusTicks = subDays(Date.now(), this.statusHistoryTicks - 1);
            if (this.stateHistory.length == 0) {
                return nowMinusTicks;
            }

            const firstDay = new Date(this.stateHistory[0].date);
            return firstDay < nowMinusTicks ? firstDay : nowMinusTicks;
        }

        private get statusHistoryItems(): StatusHistoryItem[] {
            const ticks = this.statusHistoryTicks * 24 * 60 * 60 * 1000;
            const startDate = this.statusHistoryStartDate.getTime();

            return this.stateHistory.flatMap<StatusHistoryItem>((item, i, history) => {
                const start = (item.date - startDate) / ticks;
                const end = ((history[i + 1]?.date ?? Date.now()) - startDate) / ticks;

                if (item.state == 'deleted' || item.state == null) {
                    return [{
                        status: item.state,
                        start,
                        end,
                        class: item.state ?? 'active',
                    }];
                }

                return item.state.map(state => ({
                    status: state,
                    start,
                    end,
                    class: state,
                }));
            });
        }

        private get statusHistoryWidth(): number {
            const time = Date.now() - this.statusHistoryStartDate.getTime();
            const ticks = this.statusHistoryTicks * 24 * 60 * 60 * 1000;

            return time / ticks;
        }

        private get statusHistoryLabels(): string[] {
            return [
                'LOCA: active',
                'LOCA: vacation',
                'LOCA: inactive',
                'LOCA: inactive-long',
                'LOCA: banned',
                'LOCA: outlaw',
                'LOCA: deleted',
                'LOCA: admin',
            ];
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

    $status-bar-height: 40px;
    $status-bar-margin: 5px;
    $status: (
        admin: #f48406,
        banned: #ffffff,
        vacation: #00ffff,
        inactive: #6e6e6e,
        inactive-long: #4f4f4f,
        outlaw: #ff33ff,
        active: #7aff43,
        deleted: #880000,
    );
    $status-count: 8;
    $status-offset: (
        active: 0,
        vacation: 1,
        inactive: 2,
        inactive-long: 3,
        banned: 4,
        outlaw: 5,
        deleted: 6,
        admin: 7,
    );

    .status-history-grid {
        display: grid;
        grid-template-columns: 100px 1fr;
        grid-template-rows: #{$status-count * $status-bar-height + (
                $status-count - 1
            ) * $status-bar-margin} 100px;
        column-gap: 16px;

        > .graph,
        > .x-ticks {
            width: 100%;
            height: 100%;
            overflow: auto;
            position: relative;
        }

        > .graph {
            > .bar {
                position: absolute;
                height: $status-bar-height;
                border-radius: 4px;

                @each $name, $color in $status {
                    &.#{$name} {
                        background: $color;
                        top: #{($status-bar-height + $status-bar-margin) *
                            map-get($status-offset, $name)};
                    }
                }
            }

            > .y-tick {
                height: $status-bar-height;
                left: 0;
                width: 100%;
                top: calc(
                    var(--y-tick) * #{$status-bar-height + $status-bar-margin}
                );
                position: absolute;

                &::before {
                    position: absolute;
                    content: "";
                    height: 1px;
                    top: calc(50% - 0.5px);
                    width: 100%;
                    display: block;
                    background: rgba(white, 0.1);
                }
            }
        }

        > .y-ticks {
            width: 100%;
            height: 100%;
            grid-row: 1 / span 2;
            display: grid;
            grid-template-rows: repeat($status-count, $status-bar-height);
            row-gap: $status-bar-margin;
            align-items: center;
        }
    }
</style>