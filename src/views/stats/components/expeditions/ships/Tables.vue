<template>
    <div>
        <grid-table
            :columns="countColumns"
            :items="countItems"
            :footer-items="countFooterItems"
            :cell-class-provider="(value) => getCellClass(value)"
            style="text-align: right"
        />

        <grid-table
            :columns="unitsColumns"
            :items="unitsItems"
            :footer-items="unitsFooterItems"
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
    import { ExpeditionEventFleet, ExpeditionFindableShipType } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';
    import { ShipType } from '@/shared/models/v1/ogame/ships/ShipType';
import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';

    @Component({})
    export default class Tables extends Vue {

        private get exposByRange(): ExpeditionEventFleet[][] {
            const expeditions = ExpeditionDataModule.expeditions;
            const exposByRange: ExpeditionEventFleet[][] = _dev_DateRanges.map(() => []);
            expeditions.forEach(expo => {
                if (expo.type != ExpeditionEventType.fleet) {
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

        private get countColumns(): GridTableColumn[] {
            return [
                {
                    key: 'ship',
                    label: '',
                },
                ..._dev_DateRanges.map((range, i) => ({
                    key: `range-${i}`,
                    label: range.label ?? 'LOCA: Since <first day>',
                })),
                {
                    key: 'percentage',
                    label: '%',
                },
            ];
        }

        private get countItems(): Record<string, any>[] {
            const exposByRange = this.exposByRange;

            //TODO: optimize
            return getNumericEnumValues<ShipType>(ExpeditionFindableShipType)
                .map(ship => ({
                    ship, //LOCA:

                    ..._dev_DateRanges
                        .map((_, rangeIndex) => exposByRange[rangeIndex])
                        .reduce((acc, expos, i) => {
                            acc[`range-${i}`] = expos.reduce((acc, expo) => acc + (expo.fleet[ship] ?? 0), 0);
                            return acc;
                        }, {} as Record<string, number>),

                    percentage: 'TODO', //TODO: percentage
                }));
        }

        private get countFooterItems(): Record<string, any>[] {
            const exposByRange = this.exposByRange;

            return [{
                type: 'LOCA: Total',

                ..._dev_DateRanges
                    .map((_, rangeIndex) => exposByRange[rangeIndex])
                    .reduce((acc, expos, i) => {
                        acc[`range-${i}`] = expos.reduce(
                            (acc, expo) => acc + Object.values(expo.fleet).reduce((acc: number, n) => acc + n!, 0)
                            , 0);
                        return acc;
                    }, {} as Record<string, number>),

                percentage: '',
            }];
        }

        private get unitsColumns(): GridTableColumn[] {
            return [
                {
                    key: 'resource',
                    label: '',
                },
                ..._dev_DateRanges.map((range, i) => ({
                    key: `range-${i}`,
                    label: range.label ?? 'LOCA: Since <first day>',
                })),
                {
                    key: 'percentage',
                    label: '%',
                },
            ];
        }

        private get unitsItems(): Record<string, any>[] {
            const exposByRange = this.exposByRange;

            return [];
            //TODO: implement units by resource
            // return Object.values(ResourceType)
            //     .map(resource => ({
            //         resource, //LOCA:

            //         ..._dev_DateRanges
            //             .map((_, rangeIndex) => exposByRange[rangeIndex])
            //             .reduce((acc, expos, i) => {
            //                 acc[`range-${i}`] = expos.reduce((acc, expo) => acc + (expo.fleet[ship] ?? 0), 0);
            //                 return acc;
            //             }, {} as Record<string, number>),

            //         percentage: 'TODO', //TODO: percentage
            //     }));
        }

        private get unitsFooterItems(): Record<string, any>[] {
            const exposByRange = this.exposByRange;
            return [];

            //TODO: implement units by resource
            // return [{
            //     type: 'LOCA: Total',

            //     ..._dev_DateRanges
            //         .map((_, rangeIndex) => exposByRange[rangeIndex])
            //         .reduce((acc, expos, i) => {
            //             acc[`range-${i}`] = expos.reduce(
            //                 (acc, expo) => acc + Object.values(expo.fleet).reduce((acc: number, n) => acc + n!, 0)
            //                 , 0);
            //             return acc;
            //         }, {} as Record<string, number>),

            //     percentage: '',
            // }];
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