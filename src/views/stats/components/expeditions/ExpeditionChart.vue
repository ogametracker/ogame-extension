<template>
    <scrollable-chart
        :datasets="computedDatasets"
        :x-label-formatter="(index) => formatDate(index)"
        :no-legend="noLegend"
    >
        <template #tooltip-footer="{ datasets }">
            <slot name="tooltip-footer" :datasets="datasets" />
        </template>
    </scrollable-chart>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { addDays, differenceInDays, startOfDay } from 'date-fns';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { ExpeditionDataModule } from '@stats/data/ExpeditionDataModule';
    import { ScrollableChartDataset } from '@stats/components/common/ScrollableChart.vue';
    import { ExpeditionEvent } from '@/shared/models/v1/expeditions/ExpeditionEvents';

    export type ExpeditionFilterFunction = (expedition: ExpeditionEvent) => boolean;

    export interface ExpeditionDataset {
        key: string;
        label: string;
        color: string;
        getValue: (expeditions: ExpeditionEvent[]) => number;
        filled?: boolean;
        stack?: boolean;
        showAverage?: boolean;
    }

    @Component({})
    export default class ExpeditionChart extends Vue {

        @Prop({ required: true, type: Function as PropType<ExpeditionFilterFunction>, default: () => true })
        private filter!: ExpeditionFilterFunction;

        @Prop({ required: true, type: Array as PropType<ExpeditionDataset[]> })
        private datasets!: ExpeditionDataset[];

        @Prop({ required: false, type: Boolean })
        private noLegend!: boolean;


        private get computedDatasets(): ScrollableChartDataset[] {
            const perDay = ExpeditionDataModule.expeditionsPerDay;
            const firstDay = ExpeditionDataModule.firstDay;
            const dayCount = differenceInDays(startOfDay(Date.now()), firstDay);
            const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(firstDay, add).getTime());

            const filteredExposPerDay = days.map(day => (perDay[day] ?? []).filter(expo => this.filter(expo)));

            const includeDaysWithoutDataInAvg = false; //TODO: from settings
            const filteredExpoDays = includeDaysWithoutDataInAvg
                ? filteredExposPerDay.length
                : filteredExposPerDay.filter(expos => expos.length > 0).length;

            return this.datasets.map(dataset => {
                const values = filteredExposPerDay.map(expos => dataset.getValue(expos));
                const total = values.reduce((acc, cur) => acc + cur, 0);

                return {
                    key: dataset.key,
                    color: dataset.color,
                    label: dataset.label,
                    values: values,
                    filled: dataset.filled ?? true,
                    stack: dataset.stack ?? true,
                    hidePoints: false,
                    average: total / Math.max(1, filteredExpoDays),
                };
            });
        }

        private formatDate(index: number): string {
            const firstDay = ExpeditionDataModule.firstDay;
            const day = addDays(firstDay, index);

            return this.$date(day);
        }
    }
</script>