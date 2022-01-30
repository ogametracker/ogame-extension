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
    import { ShipType } from '@/shared/models/v1/ogame/ships/ShipType';
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
                            (acc, ship) => acc + this.getResources(ship, expo.fleet[ship] ?? 0)[resource]
                        ), 0),
                })),
                {
                    key: 'total',
                    label: 'LOCA: Total Units (MSU)',
                    color: '#999999',
                    filled: false,
                    getValue: (expos: ExpeditionEvent[]) => (expos as ExpeditionEventFleet[]).reduce(
                        (acc, expo) => acc + getNumericEnumValues(ExpeditionFindableShipType).reduce(
                            (acc, ship) => {
                                const res = this.getResources(ship, expo.fleet[ship] ?? 0);
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

        private getResources(ship: ExpeditionFindableShipType, count: number): Record<ResourceType, number> {
            let metal = 0;
            let crystal = 0;
            let deuterium = 0;

            // TODO: should use shared model(s)
            switch (ship) {
                case ExpeditionFindableShipType.lightFighter: {
                    metal = 3_000;
                    crystal = 1_000;
                    break;
                }
                case ExpeditionFindableShipType.heavyFighter: {
                    metal = 5_000;
                    crystal = 4_000;
                    break;
                }
                case ExpeditionFindableShipType.cruiser: {
                    metal = 20_000;
                    crystal = 7_000;
                    deuterium = 2_000;
                    break;
                }
                case ExpeditionFindableShipType.battleship: {
                    metal = 45_000;
                    crystal = 15_000;
                    break;
                }
                case ExpeditionFindableShipType.battlecruiser: {
                    metal = 30_000;
                    crystal = 40_000;
                    deuterium = 15_000;
                    break;
                }
                case ExpeditionFindableShipType.bomber: {
                    metal = 50_000;
                    crystal = 25_000;
                    deuterium = 15_000;
                    break;
                }
                case ExpeditionFindableShipType.destroyer: {
                    metal = 60_000;
                    crystal = 50_000;
                    deuterium = 15_000;
                    break;
                }
                case ExpeditionFindableShipType.reaper: {
                    metal = 85_000;
                    crystal = 55_000;
                    deuterium = 20_000;
                    break;
                }
                case ExpeditionFindableShipType.pathfinder: {
                    metal = 8_000;
                    crystal = 15_000;
                    deuterium = 8_000;
                    break;
                }

                case ExpeditionFindableShipType.smallCargo: {
                    metal = 2_000;
                    crystal = 2_000;
                    break;
                }
                case ExpeditionFindableShipType.largeCargo: {
                    metal = 6_000;
                    crystal = 6_000;
                    break;
                }
                case ExpeditionFindableShipType.espionageProbe: {
                    crystal = 1_000;
                    break;
                }
            }

            return {
                [ResourceType.metal]: metal * count,
                [ResourceType.crystal]: crystal * count,
                [ResourceType.deuterium]: deuterium * count,
            };
        }
    }
</script>