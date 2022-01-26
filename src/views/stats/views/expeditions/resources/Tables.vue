<template>
    <div>
        <grid-table
            :columns="columns"
            :items="items"
            :footer-items="footerItems"
            :cell-class-provider="(value) => getCellClass(value)"
            style="text-align: right"
        />

        <h2>LOCA: Sizes</h2>
        <grid-table
            :columns="sizeColumns"
            :items="sizeItems"
            :footer-items="sizeFooterItems"
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
    import { ExpeditionEventResources } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import { ExpeditionEventSize } from '@/shared/models/v1/expeditions/ExpeditionEventSize';

    @Component({})
    export default class Tables extends Vue {

        private get exposByRange(): ExpeditionEventResources[][] {
            const expeditions = ExpeditionDataModule.expeditions;
            const exposByRange: ExpeditionEventResources[][] = _dev_DateRanges.map(() => []);
            expeditions.forEach(expo => {
                if (expo.type != ExpeditionEventType.resources) {
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

        private get columns(): GridTableColumn[] {
            return [
                {
                    key: 'resource',
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

        private get items(): Record<string, any>[] {
            const exposByRange = this.exposByRange;

            //TODO: optimize
            return Object.values(ResourceType).map(resource => ({
                resource, //LOCA:

                ..._dev_DateRanges.map(
                    (_, rangeIndex) => exposByRange[rangeIndex].reduce(
                        (acc, expo) => acc + expo.resources[resource]
                        , 0)
                ),

                percentage: 'TODO', //TODO: percentage
            }));
        }

        private get footerItems(): Record<string, any>[] {
            const exposByRange = this.exposByRange;

            return [
                {
                    resource: 'LOCA: Total',

                    ..._dev_DateRanges.map(
                        (_, rangeIndex) => exposByRange[rangeIndex].reduce(
                            (acc, expo) => acc
                                + expo.resources.metal
                                + expo.resources.crystal
                                + expo.resources.deuterium
                            , 0)
                    ),

                    percentage: '',
                },
                {
                    resource: 'LOCA: Total (MSU)',

                    //TODO: MSU conversion from settings
                    ..._dev_DateRanges.map(
                        (_, rangeIndex) => exposByRange[rangeIndex].reduce(
                            (acc, expo) => acc
                                + expo.resources.metal
                                + expo.resources.crystal * 2
                                + expo.resources.deuterium * 3
                            , 0)
                    ),

                    percentage: '',
                }
            ];
        }

        private get sizeColumns(): GridTableColumn[] {
            return [
                {
                    key: 'size',
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

        private get sizeItems(): Record<string, any>[] {
            const exposByRange = this.exposByRange;

            //TODO: optimize
            return Object.values(ExpeditionEventSize).map(size => ({
                size, //LOCA:

                ..._dev_DateRanges.map(
                    (_, rangeIndex) => exposByRange[rangeIndex].filter(
                        expo => expo.size == size
                    ).length
                ),

                percentage: 'TODO', //TODO: percentage
            }));
        }

        private get sizeFooterItems(): Record<string, any>[] {
            const exposByRange = this.exposByRange;

            return [{
                size: 'LOCA: Total',
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