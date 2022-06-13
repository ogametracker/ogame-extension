<template>
    <div class="highscores">
        <div class="player-selection">
            <input
                type="text"
                v-model="selectedPlayerName"
                placeholder="TODO: Player search here"
                list="player-list"
                @change="onPlayerSelected($event.target.value)"
            />
            <datalist id="player-list">
                <option v-for="name in playerNames" :key="name">
                    {{ name }}
                </option>
            </datalist>

            <div v-for="player in selectedPlayers" :key="player.id">
                <span class="mdi mdi-delete" @click="removePlayer(player.id)" />
                <span v-text="player.name" />
            </div>
        </div>

        <tabs :tabs="tabs">
            <template v-for="key in keys">
                <template :slot="`tab-content-${key}`">
                    <scrollable-chart
                        v-if="playerIds.length > 0"
                        :key="`score-${key}`"
                        :datasets="scoreDatasets[key]"
                        continue-last-value
                        show-x-values-in-grid
                        :tick-interval="1000 * 60 * 60 * 24"
                        :ticks="30"
                        :tick-list="days"
                        :min-tick="firstDay"
                        :max-tick="nextDay"
                        :x-label-formatter="(x) => $date(x)"
                        :x-label-tooltip-formatter="(x) => $datetime(x)"
                    />
                </template>
            </template>
        </tabs>
    </div>
</template>

<script lang="ts">
    import { PlayerHistory } from '@/shared/models/universe-history/PlayerHistory';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GlobalOgameMetaData } from '../../../data/global';
    import { UniverseHistoryDataModule } from '../../../data/UniverseHistoryDataModule';
    import startOfDay from 'date-fns/startOfDay/index';
    import { addDays } from 'date-fns';
    import { ScrollableChartDataset } from '../../../components/common/ScrollableChart.vue';
    import { Tab } from '../../../components/common/Tabs.vue';

    @Component({})
    export default class Players extends Vue {
    //     private readonly colors = [
    //         '#F48FB1', // pink lighten-3
    //         '#673AB7', // deep-purple
    //         '#E53935', // red darken-1
    //         '#3F51B5', // indigo
    //         '#006064', // cyan darken-4
    //         '#546E7A', // blue-grey darken-1
    //         '#EF9A9A', // red lighten-3
    //         '#64B5F6', // blue lighten-2
    //         '#FFE082', // amber lighten-3
    //         '#E91E63', // pink
    //         '#BA68C8', // purple lighten-2
    //         '#BF360C', // deep-orange darken-4
    //         '#039BE5', // light-blue darken-1
    //         '#8E24AA', // purple darken-1
    //         '#9CCC65', // light-green lighten-1
    //         '#A1887F', // brown lighten-2
    //         '#0097A7', // cyan darken-2
    //         '#FFAB91', // deep-orange lighten-3
    //         '#009688', // teal
    //         '#43A047', // green darken-1
    //         '#1A237E', // indigo darken-4
    //         '#558B2F', // light-green darken-3
    //         '#311B92', // deep-purple darken-4
    //         '#880E4F', // pink darken-4
    //         '#01579B', // light-blue darken-4
    //         '#AFB42B', // lime darken-2
    //         '#1E88E5', // blue darken-1
    //         '#827717', // lime darken-4
    //         '#FFF176', // yellow lighten-2
    //         '#BDBDBD', // grey lighten-1
    //         '#FFC107', // amber
    //         '#FFA726', // orange lighten-1
    //         '#FF5722', // deep-orange
    //         '#795548', // brown
    //         '#004D40', // teal darken-4
    //         '#81C784', // green lighten-2
    //         '#90A4AE', // blue-grey lighten-2
    //         '#757575', // grey darken-1
    //         '#FDD835', // yellow darken-1
    //     ];

    //     private leftX = 0;
    //     private rightX = 1;
    //     private ready = false;

    //     private readonly keys: ScoreKey[] = ['total', 'economy', 'research', 'military', 'militaryBuilt', 'militaryDestroyed', 'militaryLost', 'honor', 'numberOfShips'];
    //     private get tabs(): (Tab & { key: ScoreKey })[] {
    //         return [
    //             {
    //                 key: 'total',
    //                 label: 'LOCA: total',
    //             },
    //             {
    //                 key: 'economy',
    //                 label: 'LOCA: economy',
    //             },
    //             {
    //                 key: 'research',
    //                 label: 'LOCA: research',
    //             },
    //             {
    //                 key: 'military',
    //                 label: 'LOCA: military',
    //             },
    //             {
    //                 key: 'militaryBuilt',
    //                 label: 'LOCA: militaryBuilt',
    //             },
    //             {
    //                 key: 'militaryDestroyed',
    //                 label: 'LOCA: militaryDestroyed',
    //             },
    //             {
    //                 key: 'militaryLost',
    //                 label: 'LOCA: militaryLost',
    //             },
    //             {
    //                 key: 'honor',
    //                 label: 'LOCA: honor',
    //             },
    //             {
    //                 key: 'numberOfShips',
    //                 label: 'LOCA: numberOfShips',
    //             },
    //         ];
    //     }

    //     private get playerIds(): number[] {
    //         return (this.$route.query.players as string | null ?? '')
    //             .split(',')
    //             .filter(id => id.length > 0)
    //             .map(pid => parseIntSafe(pid, 10));
    //     }

    //     private mounted() {
    //         if (this.playerIds.length == 0) {
    //             this.$router.replace({
    //                 name: 'universe-history/players/highscore',
    //                 query: {
    //                     players: GlobalOgameMetaData.playerId.toString(),
    //                 },
    //             });
    //         }

    //         const playerHistories = this.playerHistories;
    //         const { min, max } = this.getMinAndMaxDates(playerHistories[0]);
    //         this.leftX = min;
    //         this.rightX = max;

    //         this.ready = true;
    //     }

    //     private get firstDay() {
    //         let { min } = this.getMinAndMaxDates(this.playerHistories[0]);
    //         return startOfDay(min).getTime();
    //     }

    //     private get nextDay() {
    //         return addDays(startOfDay(Date.now()), 1).getTime();
    //     }

    //     private get days() {
    //         const days: number[] = [];

    //         const maxDay = this.nextDay;
    //         for (let day = this.firstDay; day <= this.nextDay; day = addDays(day, 1).getTime()) {
    //             days.push(day);
    //         }

    //         return days;
    //     }

    //     private getMinAndMaxDates(history: PlayerHistory): { min: number, max: number } {
    //         const dates = [...new Set([
    //             ...history.name.map(n => n.date),
    //             ...Object.values(history.scores).flatMap(score => score.map(s => s.date)),
    //             ...Object.values(history.scorePositions).flatMap(score => score.map(s => s.date)),
    //             ...history.alliance.map(n => n.date),
    //             ...history.state.map(s => s.date),
    //             ...Object.values(history.planets).flatMap(p => [
    //                 ...p!.name.map(h => h.date),
    //                 ...p!.state.map(h => h.date),
    //                 ...p!.coordinates.map(h => h.date),
    //                 ...Object.values(p!.moon).flatMap(m => [
    //                     ...m!.name.map(h => h.date),
    //                     ...m!.state.map(h => h.date),
    //                 ]),
    //             ]),
    //         ])];
    //         dates.sort((a, b) => a - b);
    //         const [min, max] = [dates[0], dates[dates.length - 1]];

    //         return {
    //             min,
    //             max,
    //         };
    //     }

    //     private get playerHistories() {
    //         const playerHistories = UniverseHistoryDataModule.history!.players;//TODO: !
    //         return this.playerIds
    //             .map(pid => playerHistories[pid])
    //             .filter(ph => ph != null) as PlayerHistory[];
    //     }

    //     private get positionDatasets(): Record<ScoreKey, ScrollableChartDataset[]> {
    //         const playerHistories = this.playerHistories;

    //         return this.keys.reduce((result, key) => {
    //             result[key] = playerHistories.map((player, i) => ({
    //                 key: `${player.id}-${key}`,
    //                 values: player.scorePositions[key].map(h => ({ x: h.date, y: h.value })),
    //                 color: this.colors[i],
    //                 label: player.name.slice(-1)[0].value,
    //                 filled: false,
    //                 stack: false,
    //                 hidePoints: false,
    //             }));
    //             return result;
    //         }, {} as Record<ScoreKey, ScrollableChartDataset[]>);
    //     }

    //     private get scoreDatasets(): Record<ScoreKey, ScrollableChartDataset[]> {
    //         const playerHistories = this.playerHistories;

    //         return this.keys.reduce((result, key) => {
    //             result[key] = playerHistories.map((player, i) => ({
    //                 key: `${player.id}-${key}`,
    //                 values: player.scores[key].map(h => ({ x: h.date, y: h.value })),
    //                 color: this.colors[i],
    //                 label: player.name.slice(-1)[0].value,
    //                 filled: false,
    //                 stack: false,
    //                 hidePoints: false,
    //             }));
    //             return result;
    //         }, {} as Record<ScoreKey, ScrollableChartDataset[]>);
    //     }


    //     private selectedPlayerName = '';

    //     private get players() {
    //         return Object.values(UniverseHistoryDataModule.history!.players) as PlayerHistory[];//TODO: !
    //     }

    //     private get playerNames() {
    //         return this.players
    //             .map(player => player.name.slice(-1)[0].value)
    //             .sort();
    //     }

    //     private get selectedPlayers() {
    //         return this.playerIds.map(pid => {
    //             const data = UniverseHistoryDataModule.history!.players[pid];//TODO: !
    //             if (data == null) {
    //                 return null;
    //             }

    //             return {
    //                 id: pid,
    //                 name: data.name.slice(-1)[0].value,
    //             };
    //         });
    //     }

    //     private async onPlayerSelected(name: string) {
    //         const player = this.players.find(p => p.name.slice(-1)[0].value == name);
    //         if (player == null) {
    //             return;
    //         }

    //         const playerIds = (this.$route.query.players as string | null)?.split(',') ?? [];
    //         await this.updatePlayerIdRoute([
    //             ...playerIds.filter(pid => pid != player.id.toString()),
    //             player.id,
    //         ]);

    //         this.selectedPlayerName = '';
    //     }

    //     private async removePlayer(id: number) {
    //         await this.updatePlayerIdRoute(this.playerIds.filter(pid => pid != id));
    //     }

    //     private async updatePlayerIdRoute(ids: (string | number)[]) {
    //         await this.$router.replace({
    //             query: {
    //                 players: ids.join(','),
    //             },
    //         });
    //     }
    }

    // type ScoreKey = keyof PlayerHistory['scores'];
</script>
<style lang="scss" scoped>
    .highscores {
        display: grid;
        grid-template-columns: 200px 1fr;
        height: 100%;
    }
</style>