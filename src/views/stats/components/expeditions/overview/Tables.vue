<template>
    <div>
        <grid-table
            :columns="columns"
            :items="items"
            :footer-items="footerItems"
            :cell-class-provider="(value) => getCellClass(value)"
            style="text-align: right"
        />
    </div>
</template>

<script lang="ts">
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import { ExpeditionDataModule } from '../../../data/ExpeditionDataModule';
    import { GridTableColumn } from '../../common/GridTable.vue';
    import { _dev_DateRanges } from '../../../_dev/DateRanges';
    import { isInRange } from '../../../utils/dateRanges';
    import { ExpeditionEvent } from '@/shared/models/v1/expeditions/ExpeditionEvents';

    @Component({})
    export default class Tables extends Vue {
        private get columns(): GridTableColumn[] {
            return [
                {
                    key: 'type',
                    label: '',
                },
                ..._dev_DateRanges.map((range, i) => ({
                    key: i.toString(),
                    label: range.label ?? 'LOCA: Since <first day>',
                })),
                {
                    key: 'percentage',
                    label: '%',
                },
            ];
        }

        private get exposByRange(): ExpeditionEvent[][] {
            const expeditions = ExpeditionDataModule.expeditions;
            const exposByRange: ExpeditionEvent[][] = _dev_DateRanges.map(() => []);
            expeditions.forEach(expo => {
                _dev_DateRanges.forEach((range, i) => {
                    if (isInRange(expo.date, range)) {
                        exposByRange[i].push(expo);
                    }
                });
            });

            return exposByRange;
        }

        private get items(): Record<string, any>[] {
            const exposByRange = this.exposByRange;

            //TODO: optimize
            return Object.values(ExpeditionEventType).map(type => ({
                type, //LOCA:

                ..._dev_DateRanges.map((_, rangeIndex) => exposByRange[rangeIndex].filter(expo => expo.type == type).length),

                percentage: 'TODO', //TODO: percentage
            }));
        }

        private get footerItems(): Record<string, any>[] {
            const exposByRange = this.exposByRange;

            return [{
                type: 'LOCA: Gesamt',

                ..._dev_DateRanges.map((_, rangeIndex) => exposByRange[rangeIndex].length),

                percentage: '',
            }];
        }

        private getCellClass(value: any): string {
            if (value === 0) {
                return 'fade-value';
            }

            return '';
        }
    }
</script>
<style lang="scss" scoped>
    .grid-table::v-deep .fade-value {
        color: rgba(white, 0.1);
    }
</style>