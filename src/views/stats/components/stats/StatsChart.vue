<template>
    <scrollable-chart
        :datasets="computedDatasets"
        :x-label-formatter="formatDayIndex"
        :no-legend="noLegend"
        :hide-tooltip-footer="noTooltipFooter"
    >
        <template #tooltip-footer="{ datasets }">
            <slot name="tooltip-footer" :datasets="datasets" />
        </template>
    </scrollable-chart>
</template>

<script lang="ts">
export type StatsChartItemFilterFunction<T> = (item: T) => boolean;

export interface StatsChartDataset<T> {
    key: string;
    label: string;
    color: string;
    getValue: (item: T) => number;
    filled?: boolean;
    stack?: boolean;
    showAverage?: boolean;
}
</script>

<script setup lang="ts" generic="T">
import { computed } from 'vue';
import { formatDate } from '@stats/i18n';
import type { PropType } from 'vue';
import { addDays, differenceInDays, startOfDay, subDays } from 'date-fns';
import type { ScrollableChartDataset } from '@stats/components/common/scrollable-chart/ScrollableChart.vue';

const props = defineProps({
    datasets: { required: true, type: Array as PropType<StatsChartDataset<T>[]> },
    noLegend: { required: false, type: Boolean },
    noTooltipFooter: { required: false, type: Boolean },
    firstDay: { required: true, type: [Number, Date] as PropType<number | Date> },
    itemsPerDay: { required: true, type: Object as PropType<Partial<Record<number, T>>> },
    minDays: { required: false, type: Number, default: () => 30 },
});

const minDay = computed(() => {
    const firstDay = typeof props.firstDay === 'number' ? props.firstDay : props.firstDay.getTime();
    const today = startOfDay(Date.now());
    return Math.min(firstDay, subDays(today, props.minDays - 1).getTime());
});

const computedDatasets = computed<ScrollableChartDataset[]>(() => {
    const localMinDay = minDay.value;
    const dayCount = differenceInDays(startOfDay(Date.now()), localMinDay);
    const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(localMinDay, add).getTime());

    const itemByDay = days.map(day => props.itemsPerDay[day] ?? null);
    const filteredItemDays = itemByDay.filter(items => items != null).length;

    return props.datasets.map(dataset => {
        const values = itemByDay.map(item => item == null ? 0 : dataset.getValue(item));
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
});

function formatDayIndex(index: number): string {
    const day = addDays(minDay.value, index);
    return formatDate(day, 'date');
}
</script>
