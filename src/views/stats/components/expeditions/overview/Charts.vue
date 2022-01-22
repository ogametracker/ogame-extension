<template>
    <div style="height: 100%">
        <scrollable-chart
            :datasets="datasets"
            stacked
            filled
            :x-label-formatter="(x) => formatX(x)"
            :footer-provider="(values) => getSum(values)"
        />
    </div>
</template>

<script lang="ts">
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { startOfDay } from 'date-fns';
    import differenceInDays from 'date-fns/differenceInDays';
    import addDays from 'date-fns/esm/addDays/index';
    import { Component, Vue } from 'vue-property-decorator';
    import { ScrollableChartDataset } from '../../common/ScrollableChart.vue';

    @Component({})
    export default class Charts extends Vue {
        private readonly colors: Record<ExpeditionEventType, string> = {
            [ExpeditionEventType.nothing]: '#2472f3',
            [ExpeditionEventType.resources]: '#c72525',
            [ExpeditionEventType.fleet]: '#fbbc04',
            [ExpeditionEventType.delay]: '#9ecc00',
            [ExpeditionEventType.early]: '#00a95e',
            [ExpeditionEventType.darkMatter]: '#075263',
            [ExpeditionEventType.pirates]: '#de5200',
            [ExpeditionEventType.aliens]: '#16a8d4',
            [ExpeditionEventType.item]: '#ad135e',
            [ExpeditionEventType.trader]: '#888888',
            [ExpeditionEventType.lostFleet]: '#ffffff',
        };

        private get datasets(): ScrollableChartDataset[] {
            const perDay = ExpeditionDataModule.expeditionsPerDay;
            const firstDay = ExpeditionDataModule.firstDay;
            const dayCount = differenceInDays(startOfDay(Date.now()), firstDay);
            console.log('days', dayCount + 1);
            const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(firstDay, add).getTime());
            console.log('days array', days.length, days);
            console.log('per day', perDay);
            console.log('per day array', days.map(day => perDay[day] ?? []));

            const types = Object.values(ExpeditionEventType);
            const perTypePerDay = types.map(
                type => days.map(
                    day => (perDay[day] ?? []).filter(expo => expo.type == type).length
                )
            );


            return types
                .map((type, i) => ({
                    key: type,
                    values: perTypePerDay[i],//days.map(day => day/*(perDay[day] ?? []).filter(expo => expo.type == type).length*/),
                    color: this.colors[type],
                    label: type,
                }));
        }

        private formatX(x: number): string {
            return `Dies ist ein ${x}`;
        }

        private getSum(values: Record<string, number>): string {
            return 'LOCA: Expeditions: ' + Object.values(values).reduce((acc, cur) => acc + cur, 0).toString();
        }
    }
</script>