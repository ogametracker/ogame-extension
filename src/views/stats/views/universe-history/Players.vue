<template>
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
</template>

<script lang="ts">
    import { PlayerHistory } from '@/shared/models/universe-history/PlayerHistory';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GlobalOgameMetaData } from '../../data/GlobalOgameMetaData';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';
    import startOfDay from 'date-fns/startOfDay/index';
    import { addDays } from 'date-fns';
    import { ScrollableChartDataset } from '../../components/common/ScrollableChart.vue';
    import { Tab } from '../../components/common/Tabs.vue';

    @Component({})
    export default class Players extends Vue {
        private leftX = 0;
        private rightX = 1;
        private ready = false;

        private readonly keys: ScoreKey[] = ['total', 'economy', 'research', 'military', 'militaryBuilt', 'militaryDestroyed', 'militaryLost', 'honor', 'numberOfShips'];
        private get tabs(): (Tab & { key: ScoreKey })[] {
            return [
                {
                    key: 'total',
                    label: 'LOCA: total',
                },
                {
                    key: 'economy',
                    label: 'LOCA: economy',
                },
                {
                    key: 'research',
                    label: 'LOCA: research',
                },
                {
                    key: 'military',
                    label: 'LOCA: military',
                },
                {
                    key: 'militaryBuilt',
                    label: 'LOCA: militaryBuilt',
                },
                {
                    key: 'militaryDestroyed',
                    label: 'LOCA: militaryDestroyed',
                },
                {
                    key: 'militaryLost',
                    label: 'LOCA: militaryLost',
                },
                {
                    key: 'honor',
                    label: 'LOCA: honor',
                },
                {
                    key: 'numberOfShips',
                    label: 'LOCA: numberOfShips',
                },
            ];
        }

        private get playerIds(): number[] {
            return (this.$route.query.players as string | null ?? '')
                .split(',')
                .filter(id => id.length > 0)
                .map(pid => parseIntSafe(pid, 10));
        }

        private mounted() {
            if (this.playerIds.length == 0) {
                this.$router.replace({
                    name: 'universe-history/players',
                    query: {
                        players: GlobalOgameMetaData.playerId.toString(),
                    },
                });
            }

            const playerHistories = this.playerHistories;
            const { min, max } = this.getMinAndMaxDates(playerHistories[0]);
            this.leftX = min;
            this.rightX = max;

            this.ready = true;
        }

        private get firstDay() {
            let { min } = this.getMinAndMaxDates(this.playerHistories[0]);
            return startOfDay(min).getTime();
        }

        private get nextDay() {
            return addDays(startOfDay(Date.now()), 1).getTime();
        }

        private get days() {
            const days: number[] = [];

            const maxDay = this.nextDay;
            for (let day = this.firstDay; day <= this.nextDay; day = addDays(day, 1).getTime()) {
                days.push(day);
            }

            return days;
        }

        private getMinAndMaxDates(history: PlayerHistory): { min: number, max: number } {
            const dates = [...new Set([
                ...history.name.map(n => n.date),
                ...Object.values(history.scores).flatMap(score => score.map(s => s.date)),
                ...Object.values(history.scorePositions).flatMap(score => score.map(s => s.date)),
                ...history.alliance.map(n => n.date),
                ...history.state.map(s => s.date),
                ...Object.values(history.planets).flatMap(p => [
                    ...p!.name.map(h => h.date),
                    ...p!.state.map(h => h.date),
                    ...p!.coordinates.map(h => h.date),
                    ...Object.values(p!.moon).flatMap(m => [
                        ...m!.name.map(h => h.date),
                        ...m!.state.map(h => h.date),
                    ]),
                ]),
            ])];
            dates.sort((a, b) => a - b);
            const [min, max] = [dates[0], dates[dates.length - 1]];

            return {
                min,
                max,
            };
        }

        private get playerHistories() {
            const playerHistories = UniverseHistoryDataModule.history.players;
            return this.playerIds
                .map(pid => playerHistories[pid])
                .filter(ph => ph != null) as PlayerHistory[];
        }

        private get positionDatasets(): Record<ScoreKey, ScrollableChartDataset[]> {
            const playerHistories = this.playerHistories;

            const colors: Record<ScoreKey, string> = {
                total: 'yellow',
                economy: 'grey',
                research: 'lime',
                military: 'red',
                militaryBuilt: 'purple',
                militaryDestroyed: 'pink',
                militaryLost: 'darkred',
                honor: 'skyblue',
                numberOfShips: 'deeppink',
            };

            return this.keys.reduce((result, key) => {
                result[key] = playerHistories.map(player => ({
                    key: `${player.id}-${key}`,
                    values: player.scorePositions[key].map(h => ({ x: h.date, y: h.value })),
                    color: colors[key],
                    label: `${key} ${player.name.slice(-1)[0].value}`,
                    filled: false,
                    stack: false,
                    hidePoints: false,
                }));
                return result;
            }, {} as Record<ScoreKey, ScrollableChartDataset[]>);
        }

        private get scoreDatasets(): Record<ScoreKey, ScrollableChartDataset[]> {
            const playerHistories = this.playerHistories;

            const colors: Record<ScoreKey, string> = {
                total: 'yellow',
                economy: 'grey',
                research: 'lime',
                military: 'red',
                militaryBuilt: 'purple',
                militaryDestroyed: 'pink',
                militaryLost: 'darkred',
                honor: 'skyblue',
                numberOfShips: 'deeppink',
            };

            return this.keys.reduce((result, key) => {
                result[key] = playerHistories.map(player => ({
                    key: `${player.id}-${key}`,
                    values: player.scores[key].map(h => ({ x: h.date, y: h.value })),
                    color: colors[key],
                    label: `${key} ${player.name.slice(-1)[0].value}`,
                    filled: false,
                    stack: false,
                    hidePoints: false,
                }));
                return result;
            }, {} as Record<ScoreKey, ScrollableChartDataset[]>);
        }
    }

    type ScoreKey = keyof PlayerHistory['scores'];
</script>