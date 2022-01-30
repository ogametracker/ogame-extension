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
    import { ExpeditionDataModule } from '@stats/data/ExpeditionDataModule';
    import { GridTableColumn } from '@stats/components/common/GridTable.vue';
    import { _dev_DateRanges } from '@stats/_dev/DateRanges';
    import { isInRange } from '@stats/utils/dateRanges';
    import { ExpeditionEvent } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { _throw } from '@/shared/utils/_throw';

    export interface RangedExpeditionTableItem {
        label: string;
        getValue: (expeditions: ExpeditionEvent[]) => number;
    }

    interface RangeExpeditionTableRow {
        label: string;
        percentage?: number | '';

        [index: number]: number;
    }

    @Component({})
    export default class RangedExpeditionTable extends Vue {
        //TODO: footer row configuration prop(s)

        @Prop({ required: false, type: Function as PropType<(expedition: ExpeditionEvent) => boolean>, default: () => true })
        private filter!: (expedition: ExpeditionEvent) => boolean;

        @Prop({ required: false, type: Boolean })
        private showPercentage!: boolean;

        @Prop({ required: true, type: Array as PropType<RangedExpeditionTableItem[]> })
        private items!: RangedExpeditionTableItem[];

        @Prop({ required: false, type: Array as PropType<RangedExpeditionTableItem[]>, default: () => [] })
        private footerItems!: RangedExpeditionTableItem[];

        @Prop({ required: false, type: Object as PropType<Intl.NumberFormatOptions>, default: undefined })
        private numberFormatOptions: Intl.NumberFormatOptions | undefined;


        private get exposByRange(): ExpeditionEvent[][] {
            const expeditions = ExpeditionDataModule.expeditions;
            const exposByRange: ExpeditionEvent[][] = _dev_DateRanges.map(() => []);
            expeditions.forEach(expo => {
                const isInFilter = this.filter(expo);
                if (!isInFilter) {
                    return;
                }

                _dev_DateRanges.forEach((range, i) => {
                    if (isInRange(expo.date, range)) {
                        exposByRange[i].push(expo);
                    }
                });
            });

            return exposByRange;
        }

        private get columns(): GridTableColumn<keyof RangeExpeditionTableRow | number>[] {
            const columns: GridTableColumn<keyof RangeExpeditionTableRow | number>[] = [
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

            if (!this.showPercentage) {
                return columns;
            }

            return [
                ...columns,
                {
                    key: 'percentage',
                    label: '%',
                    formatter: (value: number | '') => value != ''
                        ? this.$number(value, {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                        })
                        : value,
                },
            ];
        }

        private get rows(): RangeExpeditionTableRow[] {
            const exposByRange = this.exposByRange;

            const allRangeIndex = _dev_DateRanges.findIndex(range => range.type == 'all') ?? _throw(`failed to find range 'all'`);

            const totalValue = Math.max(1, this.items.map(item => item.getValue(exposByRange[allRangeIndex])).reduce((acc, cur) => acc + cur, 0));

            const rows = this.items.map(item => {

                const row: RangeExpeditionTableRow = {
                    label: item.label,

                    ..._dev_DateRanges.map((_, rangeIndex) => {
                        const value = item.getValue(exposByRange[rangeIndex]);
                        return value;
                    }),
                };

                if (this.showPercentage) {
                    const allRangeValue = row[allRangeIndex];
                    row.percentage = 100 * allRangeValue / totalValue;
                }

                return row;
            });

            return rows;
        }

        private get footerRows(): RangeExpeditionTableRow[] {
            const exposByRange = this.exposByRange;

            return this.footerItems.map(item => ({
                label: item.label,
                ..._dev_DateRanges.map((_, rangeIndex) => item.getValue(exposByRange[rangeIndex])),
                percentage: '',
            }));
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