<template>
    <div>
        TODO: Player histories here: {{ playerIds }}:
        <hr />
        <scrollable-chart :datasets="datasets" />
    </div>
</template>

<script lang="ts">
    import { HistoryItem } from '@/shared/models/universe-history/HistoryItem';
    import { PlayerHistory } from '@/shared/models/universe-history/PlayerHistory';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { ScrollableChartDataset } from '../../components/common/ScrollableChart.vue';
    import { GlobalOgameMetaData } from '../../data/GlobalOgameMetaData';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';

    @Component({})
    export default class Players extends Vue {
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
                return;
            }
        }

        private get playerHistories() {
            const playerHistories = UniverseHistoryDataModule.history.players;
            return this.playerIds
                .map(pid => playerHistories[pid])
                .filter(ph => ph != null) as PlayerHistory[];
        }

        private playerScoreToValues(dates: number[], scoreHistory: HistoryItem<number>[]): number[] {
            const result: number[] = [];

            let index = 0;
            for (const curDate of dates) {
                const { date, value: score } = scoreHistory[index] ?? { date: Number.MAX_VALUE, value: null };
                if (curDate < date) {
                    result.push(result[result.length - 1] ?? 0);
                    continue;
                }

                result.push(score);
                index++;
            }

            return result;
        }

        private get datasets(): ScrollableChartDataset[] {
            const playerHistories = this.playerHistories;
            const dates = [...new Set(playerHistories.flatMap(player => player.scores.total.map(history => history.date)))]
                .sort((a, b) => a - b);

            return playerHistories.map(player => ({
                key: player.id,
                values: this.playerScoreToValues(dates, player.scores.total),
                color: 'yellow',
                label: `total ${player.name.slice(-1)[0].value}`,
                filled: false,
                stack: false,
                hidePoints: false,
            }));
        }
    }
</script>