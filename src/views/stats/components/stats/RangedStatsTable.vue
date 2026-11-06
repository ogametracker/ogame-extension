<template>
    <grid-table :columns="columns" :items="rows" :footer-items="footerRows" :cell-class-provider="getCellClass" class="ranged-stats-table">
        <!-- oh god this is ugly -->
        <template v-for="(column, i) in columns" v-slot:[`cell-${column.key}`]="{ value, item }">
            <span :key="column.key" class="ranged-stats-table-cell">
                <template v-if="column.key == 'label'">
                    <slot v-if="column.slotName != null && $slots[column.slotName] != null" :name="column.slotName" :value="value" />
                    <span v-else :key="i" v-text="value" />
                </template>
                <template v-else-if="column.key == 'subLabel'">
                    <span v-for="(item, i) in item.items" :key="i" :class="item.labelClass">
                        <slot v-if="column.slotName != null && $slots[column.slotName] != null" :name="column.slotName" :value="item.label" />
                        <span v-else v-text="item.label" />
                    </span>
                </template>
                <template v-else>
                    <span v-for="(item, i) in item.items || [item]" :key="i" :class="[getCellClass(item[column.key]), item.class]">
                        <span v-if="column.formatter != null" v-text="column.formatter(item[column.key])" />
                        <span v-else v-text="item[column.key]" />
                    </span>
                </template>
            </span>
        </template>

        <template v-for="(index, name) in $slots" v-slot:[name]="data">
            <slot :name="name" v-bind="data" />
        </template>
    </grid-table>
</template>

<script lang="ts">
import type { GridTableColumn } from '@stats/components/common/GridTable.vue';

interface RangeStatsTableItemWithDate {
    date: number;
}

interface SingleRangedStatsTableItem<T extends RangeStatsTableItemWithDate> {
    label: string;
    getValue: (items: T[]) => number;
    class?: string;
    labelClass?: string;
}

interface GroupedRangedStatsTableItem<T extends RangeStatsTableItemWithDate> {
    label: string;
    items: SingleRangedStatsTableItem<T>[];
}

export type RangedStatsTableItem<T extends RangeStatsTableItemWithDate> = SingleRangedStatsTableItem<T> | GroupedRangedStatsTableItem<T>;

interface SimpleRangedStatsTableRow {
    label: string;
    percentage?: number | '';
    average?: number;

    [index: number]: number;
}

interface GroupedRangedStatsTableRow {
    label: string;
    items: SimpleRangedStatsTableRow[];
}

type RangedStatsTableRow = SimpleRangedStatsTableRow | GroupedRangedStatsTableRow;

interface RangeStatsTableColumn extends GridTableColumn<keyof SimpleRangedStatsTableRow | 'subLabel' | number> {
    slotName?: string;
}
</script>

<script setup lang="ts" generic="T extends RangeStatsTableItemWithDate">
import { computed } from 'vue';
import { translations, formatNumber, formatDate } from '@stats/i18n';
import type { PropType } from 'vue';
import { isInRange } from '@stats/utils/dateRanges';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import startOfDay from 'date-fns/startOfDay/index';
import { useSettingsStore } from '../../data/SettingsDataModule';

const props = defineProps({
    showPercentage: { required: false, type: Boolean },
    showAverage: { required: false, type: Boolean },
    items: { required: true, type: Array as PropType<RangedStatsTableItem<T>[]> },
    footerItems: { required: false, type: Array as PropType<RangedStatsTableItem<T>[]>, default: () => [] },
    numberFormatOptions: { required: false, type: Object as PropType<Intl.NumberFormatOptions | undefined>, default: undefined },
    averageNumberFormatOptions: { required: false, type: Object as PropType<Intl.NumberFormatOptions | undefined>, default: undefined },
    dataItems: { required: true, type: Array as PropType<T[]> },
});

const settingsStore = useSettingsStore();

const hasGroupedItems = computed<boolean>(() => props.items.some(item => 'items' in item));

const dateRanges = computed(() => settingsStore.settings.dateRanges);

const dataItemsByRange = computed<T[][]>(() => {
    const dataItems = props.dataItems;
    const localDataItemsByRange: T[][] = dateRanges.value.map(() => []);

    dataItems.forEach(item => {
        dateRanges.value.forEach((range, i) => {
            if (isInRange(item.date, range)) {
                localDataItemsByRange[i].push(item);
            }
        });
    });

    return localDataItemsByRange;
});

const firstDay = computed(() => {
    return dataItemsByRange.value.reduce((acc, cur) => Math.min(
        acc,
        Math.min(...cur.map(t => t.date)),
    ), Date.now());
});

const columns = computed<RangeStatsTableColumn[]>(() => {
    const localColumns: RangeStatsTableColumn[] = [
        {
            key: 'label',
            label: '',
            slotName: 'label',
        }
    ];
    if (hasGroupedItems.value) {
        localColumns.push({
            key: 'subLabel',
            label: '',
            slotName: 'subLabel',
        });
    }

    localColumns.push(...dateRanges.value.map((range, i) => ({
        key: i,
        label: range.label ?? translations().extension.settings.dateRanges.since(formatDate(firstDay.value, 'date')),
        formatter: (value: number) => formatNumber(value, props.numberFormatOptions),
    })));

    if (props.showAverage) {
        localColumns.push({
            key: 'average',
            label: translations().extension.common.averagePerDay,
            formatter: (value: number) => formatNumber(value, props.averageNumberFormatOptions ?? props.numberFormatOptions)
        });
    }

    if (props.showPercentage) {
        localColumns.push({
            key: 'percentage',
            label: '%',
            formatter: (value: number | '') => value != ''
                ? formatNumber(value, {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                })
                : value
        });
    }

    return localColumns;
});

const rows = computed<(RangedStatsTableRow & { class?: string })[]>(() => {
    const localDataItemsByRange = dataItemsByRange.value;

    const allRangeIndex = dateRanges.value.findIndex(range => range.type == 'all')
        ?? _throw(`failed to find range 'all'`);
    const dataItemDays = localDataItemsByRange[allRangeIndex].map(expo => startOfDay(expo.date).getTime());
    const daysWithDataItems = new Set(dataItemDays).size;

    const totalValue = Math.max(1, props.items
        .map(item => 'getValue' in item
            ? item.getValue(localDataItemsByRange[allRangeIndex])
            : item.items.reduce((acc, i) => acc + i.getValue(localDataItemsByRange[allRangeIndex]), 0)
        )
        .reduce((acc, cur) => acc + cur, 0)
    );

    return props.items.map(item => mapItemToRow(item, localDataItemsByRange, allRangeIndex, daysWithDataItems, totalValue));
});

function mapItemToRow(item: RangedStatsTableItem<T>, nextDataItemsByRange: T[][], allRangeIndex: number, daysWithDataItems: number, totalValue: number): (RangedStatsTableRow & { class?: string; labelClass?: string }) {
    if ('getValue' in item) {
        const row: SimpleRangedStatsTableRow & { class?: string; labelClass?: string } = {
            label: item.label,
            class: item.class,
            labelClass: item.labelClass,

            ...dateRanges.value.map((_, rangeIndex) => item.getValue(nextDataItemsByRange[rangeIndex])),
        };

        const allRangeValue = row[allRangeIndex];

        if (props.showAverage) {
            row.average = allRangeValue / Math.max(1, daysWithDataItems);
        }

        if (props.showPercentage) {
            row.percentage = 100 * allRangeValue / totalValue;
        }
        return row;
    }

    return {
        label: item.label,
        items: item.items.map(subitem => mapItemToRow(subitem, nextDataItemsByRange, allRangeIndex, daysWithDataItems, totalValue) as SimpleRangedStatsTableRow & { class?: string; labelClass?: string }),
    };
}

const footerRows = computed<RangedStatsTableRow[]>(() => {
    const localDataItemsByRange = dataItemsByRange.value;

    const allRangeIndex = dateRanges.value.findIndex(range => range.type == 'all')
        ?? _throw(`failed to find range 'all'`);
    const dataItemDays = localDataItemsByRange[allRangeIndex].map(expo => startOfDay(expo.date).getTime());
    const daysWithDataItems = new Set(dataItemDays).size;

    return props.footerItems.map(item => {
        const row: RangedStatsTableRow = {
            label: item.label,
            ...dateRanges.value.map((_, rangeIndex) => 'getValue' in item
                ? item.getValue(localDataItemsByRange[rangeIndex])
                : item.items.reduce((acc, i) => acc + i.getValue(localDataItemsByRange[rangeIndex]), 0)
            ),
            percentage: '',
        };

        if (props.showAverage) {
            const allRangeValue = row[allRangeIndex];
            row.average = allRangeValue / Math.max(1, daysWithDataItems);
        }

        return row;
    });
});

function getCellClass(value: any): string {
    if (value == 0) {
        return 'fade-value';
    }

    return '';
}
</script>

<style lang="scss" scoped>
    .grid-table {
        text-align: right;

        &:deep(.fade-value) {
            color: rgba(white, 0.1);
        }
    }

    .ranged-stats-table-cell {
        display: grid;
        height: 100%;
        align-items: center;
    }
</style>
