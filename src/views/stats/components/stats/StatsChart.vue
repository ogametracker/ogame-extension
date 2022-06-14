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
    import { addDays, differenceInDays, startOfDay, subDays } from 'date-fns';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { ScrollableChartDataset } from '@stats/components/common/ScrollableChart.vue';

    export type StatsChartItemFilterFunction<T> = (item: T) => boolean;

    export interface StatsChartDataset<T> {
        key: string;
        label: string;
        color: string;
        getValue: (items: T[]) => number;
        filled?: boolean;
        stack?: boolean;
        showAverage?: boolean;
    }

    @Component({})
    export default class StatsChart<T> extends Vue {

        @Prop({ required: false, type: Function as PropType<StatsChartItemFilterFunction<T>>, default: () => true })
        private filter!: StatsChartItemFilterFunction<T>;

        @Prop({ required: true, type: Array as PropType<StatsChartDataset<T>[]> })
        private datasets!: StatsChartDataset<T>[];

        @Prop({ required: false, type: Boolean })
        private noLegend!: boolean;

        @Prop({ required: true, type: [Number, Date] })
        private firstDay!: number | Date;

        @Prop({ required: true, type: Object as PropType<Record<number, T[]>> })
        private itemsPerDay!: Record<number, T[]>;

        @Prop({ required: false, type: Number, default: () => 30 })
        private minDays!: number;

        private get minDay() {
            const firstDay = typeof this.firstDay === 'number' ? this.firstDay : this.firstDay.getTime();
            const today = startOfDay(Date.now());
            return Math.min(firstDay, subDays(today, this.minDays - 1).getTime());
        }

        private get computedDatasets(): ScrollableChartDataset[] {
            const minDay = this.minDay;
            const dayCount = differenceInDays(startOfDay(Date.now()), minDay);
            const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(minDay, add).getTime());

            const filteredItemsPerDay = days.map(day => (this.itemsPerDay[day] ?? []).filter(item => this.filter(item)));

            const includeDaysWithoutDataInAvg = false; //TODO: from settings
            const filteredItemDays = includeDaysWithoutDataInAvg
                ? filteredItemsPerDay.length
                : filteredItemsPerDay.filter(items => items.length > 0).length;

            return this.datasets.map(dataset => {
                const values = filteredItemsPerDay.map(expos => dataset.getValue(expos));
                const total = values.reduce((acc, cur) => acc + cur, 0);

                return {
                    key: dataset.key,
                    color: dataset.color,
                    label: dataset.label,
                    values: values.map((y, x) => ({ x, y })),
                    filled: dataset.filled ?? true,
                    stack: dataset.stack ?? true,
                    hidePoints: false,
                    average: dataset.showAverage == true ? total / Math.max(1, filteredItemDays) : undefined,
                };
            });
        }

        private formatDate(index: number): string {
            const day = addDays(this.minDay, index);
            return this.$date(day);
        }
    }
</script>