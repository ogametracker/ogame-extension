<template>
    <expedition-chart
        :filter="(expo) => filterExpo(expo)"
        :datasets="datasets"
        stacked
        show-average
    />
</template>

<script lang="ts">
    import { ExpeditionEvent, ExpeditionEventFleet, ExpeditionEventResources, ExpeditionFindableShipType } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import ExpeditionChart, { ExpeditionDataset } from '@stats/components/expeditions/ExpeditionChart.vue';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import { getResources } from './getResources';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';

    @Component({
        components: {
            ExpeditionChart,
        },
    })
    export default class Charts extends Vue {
        //TODO: colors from settings
        private readonly colors: Record<ResourceType, string> = {
            [ResourceType.metal]: '#de5200',
            [ResourceType.crystal]: '#249df3',
            [ResourceType.deuterium]: '#14bf73',
        };

        private get datasets(): ExpeditionDataset[] {
            return [
                ...Object.values(ResourceType).map(resource => ({
                    key: resource,
                    label: `LOCA: ${resource}`, //LOCA
                    color: this.colors[resource],
                    filled: true,
                    getValue: (expos: ExpeditionEvent[]) => (expos as ExpeditionEventFleet[]).reduce(
                        (acc, expo) => acc + getNumericEnumValues(ExpeditionFindableShipType).reduce(
                            (acc, ship) => acc + getResources(ship, expo.fleet[ship] ?? 0)[resource]
                        ), 0),
                })),
                {
                    key: 'total',
                    label: 'LOCA: Total Units (MSU)',
                    color: '#999999',
                    filled: false,
                    getValue: expos => (expos as ExpeditionEventFleet[]).reduce(
                        (acc, expo) => acc + getNumericEnumValues(ExpeditionFindableShipType).reduce(
                            (acc, ship) => {
                                const res = getResources(ship, expo.fleet[ship] ?? 0);
                                return acc + res.metal + res.crystal * 2 + res.deuterium * 3;//TODO: MSU from settings
                            }
                        ), 0),
                    stack: false,
                }
            ];
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.fleet;
        }

        
    }
</script>