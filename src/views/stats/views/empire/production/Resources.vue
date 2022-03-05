<template>
    <grid-table
        :columns="columns"
        :items="items"
        :footerItems="footerItems"
        class="resources-production-table"
    >
        <template #header-metal>
            <o-resource resource="metal" size="50px" />
        </template>
        <template #header-crystal>
            <o-resource resource="crystal" size="50px" />
        </template>
        <template #header-deuterium>
            <o-resource resource="deuterium" size="50px" />
        </template>
        <template #header-total> LOCA: Total </template>
        <template #header-totalMsu> LOCA: Total (MSU) </template>

        <template #header-productionSettings>
            <div class="production-settings-mini-table">
                <span class="header" v-text="'LOCA: Production Settings'" />
                <!-- TODO: Settings as dropdowns to change? -->
                <span
                    class="header"
                    v-text="'TODO: Settings as dropdowns to change?'"
                />
                <o-building building="metal-mine" />
                <o-building building="crystal-mine" />
                <o-building building="deuterium-synthesizer" />
                <o-building building="solar-plant" />
                <o-building building="fusion-reactor" />
                <o-ship ship="solar-satellite" />
                <o-ship ship="crawler" />
            </div>
        </template>

        <template #cell-planet="{ value: planet }">
            <div class="planet-info">
                <span v-text="planet.name" />
                <span>
                    [{{ planet.coordinates.galaxy }}:{{
                        planet.coordinates.system
                    }}:{{ planet.coordinates.position }}]
                </span>
            </div>
        </template>

        <template #cell-productionSettings="{ value: settings }">
            <div class="production-settings-mini-table">
                <span v-text="settings.metalMine" />
                <span v-text="settings.crystalMine" />
                <span v-text="settings.deuteriumSynthesizer" />
                <span v-text="settings.solarPlant" />
                <span v-text="settings.fusionReactor" />
                <span v-text="settings.solarSatellite" />
                <span v-text="settings.crawler" />
            </div>
        </template>

        <template #footer-planet="{ value }">
            <span v-text="value.name" />
        </template>
        <template #cell-metal="{ value }">
            {{ $number(value) }}
        </template>
        <template #cell-crystal="{ value }">
            {{ $number(value) }}
        </template>
        <template #cell-deuterium="{ value }">
            {{ $number(value) }}
        </template>
        <template #cell-total="{ value }">
            {{ $number(value) }}
        </template>
        <template #cell-totalMsu="{ value }">
            {{ $number(value) }}
        </template>
        <template #footer-metal="{ value }">
            {{ $number(value) }}
        </template>
        <template #footer-crystal="{ value }">
            {{ $number(value) }}
        </template>
        <template #footer-deuterium="{ value }">
            {{ $number(value) }}
        </template>
        <template #footer-total="{ value }">
            {{ $number(value) }}
        </template>
        <template #footer-totalMsu="{ value }">
            {{ $number(value) }}
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/v1/empire/PlanetData';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { Component, Vue } from 'vue-property-decorator';
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
        total: number;
        totalMsu: number;

        productionSettings: PoductionSettingsItem;
    }

    interface PoductionSettingsItem {
        metalMine: number;
        crystalMine: number;
        deuteriumSynthesizer: number;
        solarPlant: number;
        fusionReactor: number;
        solarSatellite: number;
        crawler: number;
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
                {
                    key: 'total',
                    class: 'total-column',
                },
                { key: 'totalMsu' },
                {
                    key: 'productionSettings',
                    class: 'production-settings-column',
                    headerClass: 'production-settings-header-column',
                },
            ];
        }

        private get items(): ProductionItem[] {
            return this.planets.map(planet => {
                const production = this.getProduction(planet);

                return {
                    planet,
                    ...production,
                    total: production.metal + production.crystal + production.deuterium,
                    totalMsu: production.metal + production.crystal * 2 + production.deuterium * 3, //TODO: MSU from settings

                    productionSettings: {
                        metalMine: planet.productionSettings[BuildingType.metalMine],
                        crystalMine: planet.productionSettings[BuildingType.crystalMine],
                        deuteriumSynthesizer: planet.productionSettings[BuildingType.deuteriumSynthesizer],
                        solarPlant: planet.productionSettings[BuildingType.solarPlant],
                        fusionReactor: planet.productionSettings[BuildingType.fusionReactor],

                        solarSatellite: planet.productionSettings[ShipType.solarSatellite],
                        crawler: planet.productionSettings[ShipType.crawler],
                    },
                };
            });
        }

        private get footerItems(): ProductionItem[] {
            const planets = this.planets;

            const metalPerHour = planets.reduce((acc, cur) => acc + this.getProduction(cur).metal, 0);
            const crystalPerHour = planets.reduce((acc, cur) => acc + this.getProduction(cur).metal, 0);
            const deuteriumPerHour = planets.reduce((acc, cur) => acc + this.getProduction(cur).metal, 0);
            const totalPerHour = metalPerHour + crystalPerHour + deuteriumPerHour;
            const totalMsuPerHour = metalPerHour + crystalPerHour * 2 + deuteriumPerHour * 3;//TODO: MSU from settings

            return [
                {
                    planet: {
                        name: 'LOCA: ⌀ per hour',
                        coordinates: null!,
                    },
                    metal: metalPerHour / planets.length,
                    crystal: crystalPerHour / planets.length,
                    deuterium: deuteriumPerHour / planets.length,
                    total: totalPerHour / planets.length,
                    totalMsu: totalMsuPerHour / planets.length,

                    productionSettings: null!,
                },
                {
                    planet: {
                        name: 'LOCA: total per hour',
                        coordinates: null!,
                    },
                    metal: metalPerHour,
                    crystal: crystalPerHour,
                    deuterium: deuteriumPerHour,
                    total: totalPerHour,
                    totalMsu: totalMsuPerHour,

                    productionSettings: null!,
                },
                {
                    planet: {
                        name: 'LOCA: total per day',
                        coordinates: null!,
                    },
                    metal: metalPerHour * 24,
                    crystal: crystalPerHour * 24,
                    deuterium: deuteriumPerHour * 24,
                    total: totalPerHour * 24,
                    totalMsu: totalMsuPerHour * 24,

                    productionSettings: null!,
                },
                {
                    planet: {
                        name: 'LOCA: total per week',
                        coordinates: null!,
                    },
                    metal: metalPerHour * 24 * 7,
                    crystal: crystalPerHour * 24 * 7,
                    deuterium: deuteriumPerHour * 24 * 7,
                    total: totalPerHour * 24 * 7,
                    totalMsu: totalMsuPerHour * 24 * 7,

                    productionSettings: null!,
                },
            ];
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
<style lang="scss" scoped>
    .resources-production-table::v-deep {
        .total-column {
            border-left: 1px solid rgba(var(--color), 0.33);
        }

        .production-settings-column {
            border-left: 3px double rgba(var(--color), 0.5);
        }
        .production-settings-header-column {
            border-left: 3px solid transparent;
        }
    }

    .planet-info {
        display: grid;
        grid-template-columns: 1fr;
        justify-items: end;
    }

    .production-settings-mini-table {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        width: 100%;
        justify-items: center;

        > .header {
            grid-column: 1 / span 7;
        }
        > * {
            padding: 0 4px;
        }
    }
</style>