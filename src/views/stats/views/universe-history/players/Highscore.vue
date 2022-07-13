<template>
    <div class="highscores">
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
                        <span class="mdi mdi-delete" @click="removePlayer(player.id)" />
                        <span v-text="player.name" />
                    </div>
                </template>
            </grid-table>

            <tabs :tabs="tabs">
                <template v-for="key in keys">
                    <template :slot="`tab-content-${key}`">
                        <span v-if="playerScoresLoading" :key="`score-${key}-loading`" class="loading" />
                        <scrollable-chart
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
                            :x-label-formatter="(x) => $i18n.$d(x, 'date')"
                            :x-label-tooltip-formatter="(x) => $i18n.$d(x, 'datetime')"
                        />
                    </template>
                </template>
            </tabs>
        </template>
    </div>
</template>

<script lang="ts">
    import { DbUniverseHistoryScoreType } from '@/shared/db/schema/universe-history';
    import { createRecord } from '@/shared/utils/createRecord';
    import { mergeDeep } from '@/shared/utils/mergeDeep';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { _throw } from '@/shared/utils/_throw';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { ScrollableChartDataset } from '@/views/stats/components/common/scrollable-chart/ScrollableChart.vue';
    import { Tab } from '@/views/stats/components/common/Tabs.vue';
    import { GlobalOgameMetaData } from '@/views/stats/data/global';
    import { UniverseHistoryDataModule, UniverseHistoryPlayer } from '@/views/stats/data/UniverseHistoryDataModule';
    import { UniverseSpecificSettingsDataModule } from '@/views/stats/data/UniverseSpecificSettingsDataModule';
    import { addDays } from 'date-fns';
    import startOfDay from 'date-fns/startOfDay';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class Highscore extends Vue {
        private readonly colors = [
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

        private leftX = 0;
        private rightX = 1;
        private dataModuleLoading = true;
        private playerScoresLoading = true;

        private selectedPlayerName = '';
        private scoreDatasets = {} as Record<DbUniverseHistoryScoreType, ScrollableChartDataset[]>;
        private firstDay = 0;

        private readonly keys: DbUniverseHistoryScoreType[] = ['total', 'economy', 'research', 'military', 'militaryBuilt', 'militaryDestroyed', 'militaryLost', 'honor', 'numberOfShips'];
        private get tabs(): (Tab & { key: DbUniverseHistoryScoreType })[] {
            return [
                {
                    key: 'total',
                    label: this.$i18n.$t.universeHistory.highscoreTabs.total,
                },
                {
                    key: 'economy',
                    label: this.$i18n.$t.universeHistory.highscoreTabs.economy,
                },
                {
                    key: 'research',
                    label: this.$i18n.$t.universeHistory.highscoreTabs.research,
                },
                {
                    key: 'military',
                    label: this.$i18n.$t.universeHistory.highscoreTabs.military,
                },
                {
                    key: 'militaryBuilt',
                    label: this.$i18n.$t.universeHistory.highscoreTabs.militaryBuilt,
                },
                {
                    key: 'militaryDestroyed',
                    label: this.$i18n.$t.universeHistory.highscoreTabs.militaryDestroyed,
                },
                {
                    key: 'militaryLost',
                    label: this.$i18n.$t.universeHistory.highscoreTabs.militaryLost,
                },
                {
                    key: 'honor',
                    label: this.$i18n.$t.universeHistory.highscoreTabs.honor,
                },
                {
                    key: 'numberOfShips',
                    label: this.$i18n.$t.universeHistory.highscoreTabs.numberOfShips,
                },
            ];
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
                ...this.selectedPlayers.map(player => ({ player })),
            ];
        }


        private get playerIds(): number[] {
            return (this.$route.query.players as string | null ?? '')
                .split(',')
                .filter(id => id.length > 0)
                .map(playerId => parseIntSafe(playerId, 10))
                .filter(playerId => this.players.some(p => p.id == playerId));
        }

        private async mounted() {
            await UniverseSpecificSettingsDataModule.ready;
            await this.redirectToDefault();

            this.dataModuleLoading = true;
            await UniverseHistoryDataModule.ready;
            this.dataModuleLoading = false;

            await this.loadPlayerScores();
        }

        private async redirectToDefault() {
            if (this.playerIds.length != 0) {
                return;
            }

            let defaultPlayerIds = UniverseSpecificSettingsDataModule.settings.universeHistory.players.highscore;
            if (defaultPlayerIds.length == 0) {
                defaultPlayerIds = [GlobalOgameMetaData.playerId];
            }

            await this.updatePlayerIdRoute(defaultPlayerIds);
        }


        private async loadPlayerScores() {
            this.playerScoresLoading = true;


            this.scoreDatasets = {} as Record<DbUniverseHistoryScoreType, ScrollableChartDataset[]>;

            const datasetsByPlayer: Record<number, Record<DbUniverseHistoryScoreType, ScrollableChartDataset>> = {};
            this.playerIds.forEach(p => datasetsByPlayer[p] = {} as Record<DbUniverseHistoryScoreType, ScrollableChartDataset>);

            this.keys.forEach(key => {
                this.scoreDatasets[key] = [];

                this.playerIds.forEach((pid, i) => datasetsByPlayer[pid][key] = {
                    key: `${pid}-${key}`,
                    values: [],
                    color: this.colors[i % this.colors.length],
                    label: this.players.find(p => p.id == pid)?.name ?? _throw(`no player with id '${pid}' found`),
                    filled: false,
                    stack: false,
                    hidePoints: false,
                });
            });

            let minDate = Number.MAX_SAFE_INTEGER;

            const scores = await UniverseHistoryDataModule.getPlayerScoreHistory(this.playerIds);
            const types: DbUniverseHistoryScoreType[] = ['total', 'economy', 'research', 'military', 'militaryBuilt', 'militaryDestroyed', 'militaryLost', 'honor', 'numberOfShips'];
            const lastScores = createRecord(this.playerIds, () => createRecord(types, null)) as Record<number, Record<DbUniverseHistoryScoreType, number | null>>;

            scores.forEach((score, i) => {
                minDate = Math.min(minDate, score.date);

                if (lastScores[score.playerId][score.type] == score.score) { //no duplicates if only position changed
                    return;
                }

                datasetsByPlayer[score.playerId][score.type].values.push({
                    x: score.date,
                    y: score.score,
                });
                lastScores[score.playerId][score.type] = score.score;
            });

            this.keys.forEach(key => {
                this.playerIds.forEach(pid => {
                    this.scoreDatasets[key].push(datasetsByPlayer[pid][key]);
                });
            });

            this.firstDay = startOfDay(minDate).getTime();

            this.playerScoresLoading = false;
        }

        private get nextDay() {
            return addDays(startOfDay(Date.now()), 1).getTime();
        }

        private get days() {
            const days: number[] = [];

            const maxDay = this.nextDay;
            for (let day = this.firstDay; day <= maxDay; day = addDays(day, 1).getTime()) {
                days.push(day);
            }

            return days;
        }



        private get players() {
            return UniverseHistoryDataModule.players;
        }

        private get playerNames() {
            return this.players
                .map(player => player.name)
                .sort();
        }

        private get selectedPlayers() {
            return this.playerIds.map(pid => this.players.find(p => p.id == pid)!);
        }

        private async onPlayerSelected(name: string) {
            const player = this.players.find(p => p.name.toLowerCase() == name.toLowerCase());
            if (player == null) {
                return;
            }

            await this.$nextTick();
            this.selectedPlayerName = '';

            const playerIds = (this.$route.query.players as string | null)?.split(',') ?? [];
            await this.updatePlayerIdRoute([
                ...playerIds.filter(pid => pid != player.id.toString()),
                player.id,
            ]);
            await this.loadPlayerScores();
        }

        private async removePlayer(id: number) {
            await this.updatePlayerIdRoute(this.playerIds.filter(pid => pid != id));

            await this.loadPlayerScores();
        }

        private updateSettings(playerIds: number[]) {
            const settings = UniverseSpecificSettingsDataModule.settings;
            UniverseSpecificSettingsDataModule.updateSettings({
                ...settings,
                universeHistory: {
                    ...settings.universeHistory,
                    players: {
                        ...settings.universeHistory.players,
                        highscore: playerIds,
                    },
                },
            });
        }

        private async updatePlayerIdRoute(ids: (string | number)[]) {
            this.updateSettings(ids.map(id => typeof id === 'string' ? parseIntSafe(id, 10) : id));

            await this.$router.replace({
                query: {
                    players: ids.join(','),
                },
            });
            await this.redirectToDefault();
        }
    }
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

            &::v-deep {
                .player-selection-table-cell {
                    text-align: left;
                    justify-content: start;
                    border-bottom: 1px solid rgba(var(--color), 0.5);
                }
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