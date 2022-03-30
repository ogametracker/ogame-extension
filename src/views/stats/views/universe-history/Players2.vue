<template>
    <scrollable-chart-2
        v-if="datasets.length > 0 && ready"
        :datasets="datasets"
        :leftX.sync="leftX"
        :rightX.sync="rightX"
        :ticks="ticks"
    />
</template>

<script lang="ts">
    import { PlayerHistory } from '@/shared/models/universe-history/PlayerHistory';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GlobalOgameMetaData } from '../../data/GlobalOgameMetaData';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';
    import ScrollableChart2, { ScrollableChart2Dataset } from '@stats/components/common/ScrollableChart2.vue';
    import startOfDay from 'date-fns/startOfDay/index';
    import { addDays } from 'date-fns';
    import differenceInDays from 'date-fns/differenceInDays/index';

    @Component({
        components: {
            ScrollableChart2,
        }
    })
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
                    name: 'universe-history/players2',
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

        private get ticks() {
            let { min, max } = this.getMinAndMaxDates(this.playerHistories[0]);
            min = startOfDay(min).getTime();
            max = addDays(startOfDay(max), 1).getTime();
            const dayDiff = differenceInDays(max, min);

            return Array.from({ length: dayDiff + 1 })
                .map((_, offset) => min + offset * 24 * 60 * 60 * 1000);
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

        private get datasets(): ScrollableChart2Dataset[] {
            const playerHistories = this.playerHistories;

            return playerHistories.map(player => ({
                key: player.id,
                values: player.scores.total.map(h => ({ x: h.date, y: h.value })),
                color: 'yellow',
                label: `total ${player.name.slice(-1)[0].value}`,
                filled: false,
                stack: false,
                hidePoints: false,
            }));
        }
    }
</script>