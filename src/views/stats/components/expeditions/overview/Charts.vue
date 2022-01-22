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
        //TODO: colors from settings
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
            const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(firstDay, add).getTime());

            const types = Object.values(ExpeditionEventType);
            const perTypePerDay = types.map(
                type => days.map(
                    day => (perDay[day] ?? []).filter(expo => expo.type == type).length
                )
            );

            return types
                .map((type, i) => ({
                    key: type,
                    values: perTypePerDay[i],
                    color: this.colors[type],
                    label: 'LOCA: ' + type, //LOCA
                }));
        }

        private formatX(x: number): string {
            const firstDay = ExpeditionDataModule.firstDay;
            const day = addDays(firstDay, x);
            //TODO: use extension locale
            return new Intl.DateTimeFormat('de', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).format(day);
        }

        private getSum(values: Record<string, number>): string {
            return 'LOCA: Expeditions: ' + Object.values(values).reduce((acc, cur) => acc + cur, 0).toString(); //LOCA
        }
    }
</script>