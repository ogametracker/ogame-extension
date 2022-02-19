<template>
    <grid-table :columns="columns" :items="items">
        <template #header-metal>
            <o-resource resource="metal" size="40px" />
        </template>
        <template #header-crystal>
            <o-resource resource="crystal" size="40px" />
        </template>
        <template #header-deuterium>
            <o-resource resource="deuterium" size="40px" />
        </template>

        <template #cell-planet="{ value: item }">
            <div class="planet-info">
                <span v-text="item.planet.name" />
                <span>
                    [{{ item.planet.coordinates.galaxy }}:{{
                        item.planet.coordinates.system
                    }}:{{ item.planet.coordinates.position }}]
                </span>
            </div>
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/v1/empire/PlanetData';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { MetalMine } from '@/shared/models/v1/ogame/buildings/MetalMine';
    import { CrystalMine } from '@/shared/models/v1/ogame/buildings/CrystalMine';
    import { DeuteriumSynthesizer } from '@/shared/models/v1/ogame/buildings/DeuteriumSynthesizer';
    import { ProductionBuildingDependencies } from '@/shared/models/v1/ogame/buildings/ProductionBuilding';
    import { BuildingType } from '@/shared/models/v1/ogame/buildings/BuildingType';
    import { Coordinates } from '@/shared/models/v1/ogame/common/Coordinates';
    import { PlanetBuildingProductionLevels } from '@/shared/models/v1/empire/PlanetBuildingProductionLevels';
    import { PlanetBuildingLevels } from '@/shared/models/v1/empire/PlanetBuildingLevels';
    import { ResearchType } from '@/shared/models/v1/ogame/research/ResearchType';
    import { ResearchLevels } from '@/shared/models/v1/empire/ResearchLevels';
    import { PlayerClass } from '@/shared/models/v1/ogame/classes/PlayerClass';
    import { AllianceClass } from '@/shared/models/v1/ogame/classes/AllianceClass';
    import { LocalPlayerData } from '@/shared/models/v1/empire/LocalPlayerData';
    import { ProductionSettings } from '@/shared/models/v1/empire/ProductionSettings';
    import { ShipType } from '@/shared/models/v1/ogame/ships/ShipType';
    import { PlanetShipCount } from '@/shared/models/v1/empire/PlanetShipCount';
    import { ItemHash } from '@/shared/models/v1/ogame/items/ItemHash';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';

    interface Production {
        metal: number;
        crystal: number;
        deuterium: number;
    }

    interface ProductionItem {
        planet: {
            name: string;
            coordinates: Coordinates;
        };
        metal: number;
        crystal: number;
        deuterium: number;
    }

    @Component({})
    export default class Resources extends Vue {
        private get columns(): GridTableColumn<keyof ProductionItem>[] {
            return [
                {
                    key: 'planet',
                    label: 'LOCA: Planet',
                },
                { key: 'metal' },
                { key: 'crystal' },
                { key: 'deuterium' },
            ];
        }

        private get items(): ProductionItem[] {
            return this.planets.map(planet => {
                const production = this.getProduction(planet);

                return {
                    planet,
                    ...production,
                };
            });
        }


        private get planets(): PlanetData[] {
            return Object.values(EmpireDataModule.empire.planets)
                .filter(planet => !planet.isMoon) as PlanetData[];
        }

        private getProduction(planet: PlanetData): Production {
            const deps: ProductionBuildingDependencies = {
                economySpeed: 8, //TODO: from server settings
                planet,
                player: EmpireDataModule.empire,
            };

            return {
                metal: MetalMine.getProduction(planet.buildings.production[BuildingType.metalMine], deps).metal,
                crystal: CrystalMine.getProduction(planet.buildings.production[BuildingType.crystalMine], deps).crystal,
                deuterium: DeuteriumSynthesizer.getProduction(planet.buildings.production[BuildingType.deuteriumSynthesizer], deps).deuterium,
            };
        }

        private get test() {
            return MetalMine.getProduction(47, {
                economySpeed: 8,
                planet: {
                    coordinates: {
                        position: 10
                    } as Coordinates,
                    buildings: {
                        production: {
                            [BuildingType.metalMine]: 47,
                            [BuildingType.crystalMine]: 38,
                            [BuildingType.deuteriumSynthesizer]: 43,
                        } as PlanetBuildingProductionLevels,
                    } as PlanetBuildingLevels,
                    productionSettings: {
                        [BuildingType.metalMine]: 100,
                        [BuildingType.crystalMine]: 100,
                        [BuildingType.deuteriumSynthesizer]: 100,
                        [ShipType.crawler]: 150,
                    } as ProductionSettings,
                    activeItems: {
                        [ItemHash.metalBooster_platinum_90days]: Date.now() + 100000000,
                    },
                    ships: {
                        [ShipType.crawler]: 10000,
                    } as PlanetShipCount,
                } as PlanetData,
                player: {
                    research: {
                        [ResearchType.plasmaTechnology]: 21,
                    } as ResearchLevels,
                    playerClass: PlayerClass.collector,
                    allianceClass: AllianceClass.trader,
                    officers: {
                        commander: true,
                        admiral: true,
                        geologist: true,
                        engineer: true,
                        technocrat: true,
                    },
                } as LocalPlayerData,
            }).crystal;
        }
    }
</script>