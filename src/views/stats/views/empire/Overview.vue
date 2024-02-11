<template>
    <grid-table :columns="columns" :items="items" class="empire-table" sticky="100%">
        <template #cell-planet="{ value }">
            <span v-text="value.name" />
            &nbsp;
            <span v-text="value.coordinates" />
        </template>

        <template #cell-supplies="{ value, item }">
            <div class="supplies-table">
                <span v-for="building in PlanetSupplyBuildingTypes" :key="building">
                    <o-building :building="building" :disabled="value[building] == 0" />
                    <span v-text="value[building]" :class="{ fade: value[building] == 0 }" />
                </span>
            </div>
        </template>

        <template #cell-facilities="{ value, item }">
            <div class="facilities-table">
                <span v-for="building in PlanetFacilityBuildingTypes" :key="building">
                    <o-building :building="building" :disabled="value[building] == 0" />
                    <span v-text="value[building]" :class="{ fade: value[building] == 0 }" />
                </span>
            </div>
        </template>

        <template #cell-ships="{ value, item }">
            <div class="ships-table">
                <span v-for="ship in ShipTypes" :key="ship">
                    <o-ship :ship="ship" :disabled="value[ship] == 0" />
                    <span v-text="value[ship]" :class="{ fade: value[ship] == 0 }" />
                </span>
            </div>
        </template>
        <template #cell-defenses="{ value, item }">
            <div class="defenses-table">
                <span v-for="defense in DefenseTypes" :key="defense">
                    <o-defense :defense="defense" :disabled="value[defense] == 0" />
                    <span v-text="value[defense]" :class="{ fade: value[defense] == 0 }" />
                </span>
            </div>
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { PlanetSupplyBuildingType, PlanetFacilityBuildingType } from '@/shared/models/ogame/buildings/BuildingTypes';
    import { PlanetSupplyBuildingTypes, PlanetFacilityBuildingTypes } from '@/shared/models/ogame/buildings/BuildingTypes';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { ShipTypes } from '@/shared/models/ogame/ships/ShipTypes';
    import { DefenseType } from '@/shared/models/ogame/defenses/DefenseType';
    import { DefenseTypes } from '@/shared/models/ogame/defenses/DefenseTypes';
    import { LifeformBuildingType, LifeformBuildingTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformTechnologySlots, LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GridTableColumn } from '@stats/components/common/GridTable.vue';
    import { EmpireDataModule } from '@stats/data/EmpireDataModule';
    import { createRecord } from '@/shared/utils/createRecord';

    type SupplyBuilding = PlanetSupplyBuildingType

    interface PlanetEmpireItem {
        planet: {
            name: string;
            coordinates: string;
        };
        supplies: Record<PlanetSupplyBuildingType, number>;
        facilities: Record<PlanetFacilityBuildingType, number>;
        ships: Record<ShipType, number>;
        defenses: Record<DefenseType, number>;
    }

    @Component({})
    export default class Overview extends Vue {

        private readonly PlanetSupplyBuildingTypes = PlanetSupplyBuildingTypes;
        private readonly PlanetFacilityBuildingTypes = PlanetFacilityBuildingTypes;
        private readonly ShipTypes = ShipTypes;
        private readonly DefenseTypes = DefenseTypes;

        private get columns(): GridTableColumn<keyof PlanetEmpireItem>[] {
            return [
                {
                    key: 'planet',
                    label: this.$i18n.$t.extension.empire.planet,
                    size: '250px',
                },
                {
                    key: 'supplies',
                    label: this.$i18n.$t.extension.empire.overview.supplyBuildings,
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'left-text',
                    class: 'left-text',
                },
                {
                    key: 'facilities',
                    label: this.$i18n.$t.extension.empire.overview.facilityBuildings,
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'left-text',
                    class: 'left-text',
                },
                // {
                //     key: 'ships',
                //     label: 'LOCA: Ships',
                //     style: {
                //         'justify-items': 'start',
                //     },
                //     headerClass: 'left-text',
                //     class: 'left-text',
                // },
                // {
                //     key: 'defenses',
                //     label: 'LOCA: Defenses',
                //     style: {
                //         'justify-items': 'start',
                //     },
                //     headerClass: 'left-text',
                //     class: 'left-text',
                // },
            ];
        }

        private get items(): PlanetEmpireItem[] {
            const player = EmpireDataModule.empire;

            const planets = player.planetOrder
                .map(planetId => player.planets[planetId])
                .filter(planet => !planet.isMoon) as PlanetData[];

            return planets.map<PlanetEmpireItem>(planet => {

                const result: PlanetEmpireItem = {
                    planet: {
                        name: planet.name,
                        coordinates: this.formatCoordinates(planet.coordinates),
                    },
                    supplies: createRecord(PlanetSupplyBuildingTypes, b => planet.buildings[b]),
                    facilities: createRecord(PlanetFacilityBuildingTypes, b => planet.buildings[b]),
                    ships: createRecord(ShipTypes, s => planet.ships[s]),
                    defenses: createRecord(DefenseTypes, d => planet.defense[d]),
                };
                return result;
            });
        }

        private formatCoordinates(coords: Coordinates) {
            return `[${coords.galaxy}:${coords.system}:${coords.position}]`;
        }
    }
</script>
<style lang="scss" scoped>
    .supplies-table,
    .facilities-table,
    .ships-table,
    .defenses-table {
        // width: 100%;
        display: grid;
        column-gap: 8px;
        justify-items: center;
            
        > span {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    }

    .supplies-table {
        grid-template-columns: repeat(8, 1fr);
    }

    .facilities-table {
        grid-template-columns: repeat(8, 1fr);
    }

    .ships-table {
        grid-template-columns: repeat(17, 1fr);
    }
    
    .defenses-table {
        grid-template-columns: repeat(8, 1fr);
    }

    .empire-table {
        max-height: 100%;

        &::v-deep {
            .left-text {
                text-align: left;
                justify-content: start;
            }

            .grid-cell {
                padding-inline: 16px;
            }

            // .center-text {
            //     text-align: center;
            //     justify-content: center;
            // }

            // .building-levels {
            //     display: grid;
            //     grid-template-columns: repeat(12, 1fr);
            //     gap: 4px;

            // }

            .fade {
                opacity: 0.1;
            }
        }
    }
</style>