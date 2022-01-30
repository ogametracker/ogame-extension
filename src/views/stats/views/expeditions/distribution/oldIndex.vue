<template>
    <scrollable-chart
        :datasets="datasets"
        :x-label-formatter="(x) => formatX(x)"
        :tooltip-value-formatter="(x) => formatTooltipValue(x)"
    />
</template>

<script lang="ts">
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { Localization } from '@/views/stats/i18n/Localization';
    import { startOfDay } from 'date-fns';
    import differenceInDays from 'date-fns/differenceInDays';
    import addDays from 'date-fns/esm/addDays/index';
    import { Component, Vue } from 'vue-property-decorator';
    import { ScrollableChartDataset } from '@stats/components/common/ScrollableChart.vue';

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
            const countPerDay = days.map(day => perDay[day]?.length ?? 0);

            return types.map((type, i) => ({
                key: type,
                values: perTypePerDay[i].map((count, dayIndex) => 100 * count / Math.max(1, countPerDay[dayIndex])),
                color: this.colors[type],
                label: 'LOCA: ' + type, //LOCA
                filled: true,
                    stack: false,
                    hidePoints: false,
            }));
        }

        private formatX(x: number): string {
            const firstDay = ExpeditionDataModule.firstDay;
            const day = addDays(firstDay, x);

            return this.$date(day);
        }

        private formatTooltipValue(n: number): string {
            return this.$number(n, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + '%';
        }
    }
</script>