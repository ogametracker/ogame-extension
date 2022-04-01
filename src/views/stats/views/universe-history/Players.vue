<template>
    <scrollable-chart
        v-if="datasets.length > 0 && ready"
        :datasets="datasets"
        continue-last-value
        show-x-values-in-grid
        :ticks="30"
        :tick-list="days"
        :min-tick="firstDay"
        :max-tick="nextDay"
        :tick-interval="tickInterval"
        :x-label-formatter="(x) => $date(x)"
        :x-label-tooltip-formatter="(x) => $datetime(x)"
    />
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

    @Component({})
    export default class Players extends Vue {
        private leftX = 0;
        private rightX = 1;
        private ready = false;

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

        private readonly tickInterval = 24 * 60 * 60 * 1000;

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

        private get datasets(): ScrollableChartDataset[] {
            const playerHistories = this.playerHistories;

            const keys: (keyof PlayerHistory['scores'])[] = ['total', 'economy', 'research', 'military', 'militaryBuilt', 'militaryDestroyed', 'militaryLost', 'honor', 'numberOfShips'];
            const colors: Record<keyof PlayerHistory['scores'], string> = {
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

            return playerHistories.flatMap(player => keys.map(key => ({
                key: `${player.id}-${key}`,
                values: player.scores[key].map(h => ({ x: h.date, y: h.value })),
                color: colors[key],
                label: `${key} ${player.name.slice(-1)[0].value}`,
                filled: false,
                stack: false,
                hidePoints: false,
            })));
        }
    }
</script>