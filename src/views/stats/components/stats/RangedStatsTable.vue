<template>
    <grid-table
        :columns="columns"
        :items="rows"
        :footer-items="footerRows"
        :cell-class-provider="(value) => getCellClass(value)"
    />
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Prop } from 'vue-property-decorator';
    import { Component, Vue } from 'vue-property-decorator';
    import { GridTableColumn } from '@stats/components/common/GridTable.vue';
    import { _dev_DateRanges } from '@stats/_dev/DateRanges';
    import { isInRange } from '@stats/utils/dateRanges';
    import { _throw } from '@/shared/utils/_throw';
    import startOfDay from 'date-fns/startOfDay/index';

    interface RangeStatsTableItemWithDate {
        date: number;
    }

    export interface RangedStatsTableItem<T extends RangeStatsTableItemWithDate> {
        label: string;
        getValue: (item: T[]) => number;
    }

    interface RangedStatsTableRow {
        label: string;
        percentage?: number | '';
        average?: number;

        [index: number]: number;
    }

    @Component({})
    export default class RangedStatsTable<T extends RangeStatsTableItemWithDate> extends Vue {
        @Prop({ required: false, type: Function as PropType<(item: T) => boolean>, default: () => true })
        private filter!: (item: T) => boolean;

        @Prop({ required: false, type: Boolean })
        private showPercentage!: boolean;

        @Prop({ required: false, type: Boolean })
        private showAverage!: boolean;

        @Prop({ required: true, type: Array as PropType<RangedStatsTableItem<T>[]> })
        private items!: RangedStatsTableItem<T>[];

        @Prop({ required: false, type: Array as PropType<RangedStatsTableItem<T>[]>, default: () => [] })
        private footerItems!: RangedStatsTableItem<T>[];

        @Prop({ required: false, type: Object as PropType<Intl.NumberFormatOptions>, default: undefined })
        private numberFormatOptions: Intl.NumberFormatOptions | undefined;

        @Prop({ required: false, type: Object as PropType<Intl.NumberFormatOptions>, default: undefined })
        private averageNumberFormatOptions: Intl.NumberFormatOptions | undefined;

        @Prop({ required: true, type: Array as PropType<T[]> })
        private dataItems!: T[];

        private get dataItemsByRange(): T[][] {
            const dataItems = this.dataItems;
            const dataItemsByRange: T[][] = _dev_DateRanges.map(() => []);

            dataItems.forEach(item => {
                const isInFilter = this.filter(item);
                if (!isInFilter) {
                    return;
                }

                _dev_DateRanges.forEach((range, i) => {
                    if (isInRange(item.date, range)) {
                        dataItemsByRange[i].push(item);
                    }
                });
            });

            return dataItemsByRange;
        }

        private get columns(): GridTableColumn<keyof RangedStatsTableRow | number>[] {
            const columns: GridTableColumn<keyof RangedStatsTableRow | number>[] = [
                {
                    key: 'label',
                    label: '',
                },
                ..._dev_DateRanges.map((range, i) => ({
                    key: i,
                    label: range.label ?? 'LOCA: Since <first day>',
                    formatter: (value: number) => this.$number(value, this.numberFormatOptions),
                })),
            ];

            if (this.showAverage) {
                columns.push({
                    key: 'average',
                    label: '⌀ LOCA: per day',
                    formatter: (value: number) => this.$number(value, this.averageNumberFormatOptions ?? this.numberFormatOptions)
                });
            }

            if (this.showPercentage) {
                columns.push({
                    key: 'percentage',
                    label: '%',
                    formatter: (value: number | '') => value != ''
                        ? this.$number(value, {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                        })
                        : value
                });
            }

            return columns;
        }

        private get rows(): RangedStatsTableRow[] {
            const dataItemsByRange = this.dataItemsByRange;

            const allRangeIndex = _dev_DateRanges.findIndex(range => range.type == 'all')
                ?? _throw(`failed to find range 'all'`);
            const dataItemDays = dataItemsByRange[allRangeIndex].map(expo => startOfDay(expo.date).getTime());
            const daysWithDataItems = new Set(dataItemDays).size;

            const totalValue = Math.max(1, this.items
                .map(item => item.getValue(dataItemsByRange[allRangeIndex]))
                .reduce((acc, cur) => acc + cur, 0)
            );

            const rows = this.items.map(item => {

                const row: RangedStatsTableRow = {
                    label: item.label,

                    ..._dev_DateRanges.map((_, rangeIndex) => item.getValue(dataItemsByRange[rangeIndex])),
                };

                const allRangeValue = row[allRangeIndex];

                if (this.showAverage) {
                    row.average = allRangeValue / daysWithDataItems;
                }

                if (this.showPercentage) {
                    row.percentage = 100 * allRangeValue / totalValue;
                }

                return row;
            });

            return rows;
        }

        private get footerRows(): RangedStatsTableRow[] {
            const dataItemsByRange = this.dataItemsByRange;

            const allRangeIndex = _dev_DateRanges.findIndex(range => range.type == 'all')
                ?? _throw(`failed to find range 'all'`);
            const dataItemDays = dataItemsByRange[allRangeIndex].map(expo => startOfDay(expo.date).getTime());
            const daysWithDataItems = new Set(dataItemDays).size;

            return this.footerItems.map(item => {
                const row: RangedStatsTableRow = {
                    label: item.label,
                    ..._dev_DateRanges.map((_, rangeIndex) => item.getValue(dataItemsByRange[rangeIndex])),
                    percentage: '',
                };

                if (this.showAverage) {
                    const allRangeValue = row[allRangeIndex];
                    row.average = allRangeValue / daysWithDataItems;
                }

                return row;
            });
        }

        private getCellClass(value: any): string {
            if (value == 0) {
                return 'fade-value';
            }

            return '';
        }
    }
</script>
<style lang="scss" scoped>
    .grid-table {
        text-align: right;

        &::v-deep .fade-value {
            color: rgba(white, 0.1);
        }
    }
</style>