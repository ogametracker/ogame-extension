<template>
    <div class="point-distribution">
        <grid-table :columns="columns" :items="items" :footerItems="footerItems" inline>
            <template #cell-points="{ value }">
                <decimal-number :value="value" />
            </template>
            <template #footer-points="{ value }">
                <decimal-number :value="value" />
            </template>
        </grid-table>
    </div>
</template>

<script lang="ts">
    import { MoonData } from '@/shared/models/empire/MoonData';
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { BuildingType, PlanetBuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { MoonBuildingTypes } from '@/shared/models/ogame/buildings/BuildingTypes';
    import { BuildingsByType, PlanetBuildingTypes } from '@/shared/models/ogame/buildings/BuildingTypes';
    import { addCost, Cost } from '@/shared/models/ogame/common/Cost';
    import { LifeformBuildingsByType, ResourceProductionBonusLifeformBuildings } from '@/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
    import { LifeformBuildingTypes, LifeformBuildingTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { ResearchByTypes, ResearchTypes } from '@/shared/models/ogame/research/ResearchTypes';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GridTableColumn } from '../../components/common/GridTable.vue';
    import { EmpireDataModule } from '../../data/EmpireDataModule';
    import { ServerSettingsDataModule } from '../../data/ServerSettingsDataModule';

    interface PlanetPointDistributionItem {
        planetId: number;

        productionBuildings: number;
        otherBuildings: number;

        lifeformBuildingsActive: number;
        lifeformBuildingsInactive: number;
        lifeformTechnologiesActive: number;
        lifeformTechnologiesInactive: number;

        defense: number;
        ships: number;
    }

    interface MoonPointDistributionItem {
        moonId: number;
        buildings: number;
        defense: number;
        ships: number;
    }

    interface PointDistributionRow {
        label: string;
        points: number;
    }

    @Component({})
    export default class PointDistribution extends Vue {

        private get columns(): GridTableColumn<keyof PointDistributionRow>[] {
            return [
                { key: 'label' },
                { key: 'points' },
            ];
        }

        private get pointDistribution() {
            const researchPoints = this.researchPoints;

            const total = {
                research: researchPoints,

                productionBuildings: 0,
                planetBuildings: 0,
                moonBuildings: 0,

                lifeformBuildingsActive: 0,
                lifeformBuildingsInactive: 0,
                lifeformTechnologiesActive: 0,
                lifeformTechnologiesInactive: 0,

                defense: 0,
                ships: 0,

                total: researchPoints,
            };

            this.planetPointDistributions.forEach(planet => {
                total.productionBuildings += planet.productionBuildings;
                total.planetBuildings += planet.otherBuildings;

                total.lifeformBuildingsActive += planet.lifeformBuildingsActive;
                total.lifeformBuildingsInactive += planet.lifeformBuildingsInactive;
                total.lifeformTechnologiesActive += planet.lifeformTechnologiesActive;
                total.lifeformTechnologiesInactive += planet.lifeformTechnologiesInactive;

                total.defense += planet.defense;
                total.ships += planet.ships;

                (Object.keys(planet) as (keyof PlanetPointDistributionItem)[]).forEach(key => {
                    if (key != 'planetId') {
                        total.total += planet[key];
                    }
                });
            });

            this.moonPointDistributions.forEach(moon => {
                total.moonBuildings += moon.buildings;

                total.defense += moon.defense;
                total.ships += moon.ships;

                (Object.keys(moon) as (keyof MoonPointDistributionItem)[]).forEach(key => {
                    if (key != 'moonId') {
                        total.total += moon[key];
                    }
                });
            });

            return total;
        }

        private get footerItems(): PointDistributionRow[] {
            return [{
                label: 'LOCA: Total',
                points: this.pointDistribution.total,
            }];
        }

        private get items(): PointDistributionRow[] {
            const total = this.pointDistribution;

            const result: PointDistributionRow[] = [
                {
                    label: 'LOCA: Production Buildings (Mines + LF Production Buildings)',
                    points: total.productionBuildings,
                },
                {
                    label: 'LOCA: Planet Buildings',
                    points: total.planetBuildings,
                },
            ];

            if (ServerSettingsDataModule.serverSettings.lifeforms.enabled) {
                result.push(
                    {
                        label: 'LOCA: Lifeform Buildings (active)',
                        points: total.lifeformBuildingsActive,
                    },
                    {
                        label: 'LOCA: Lifeform Buildings (inactive)',
                        points: total.lifeformBuildingsInactive,
                    },
                    {
                        label: 'LOCA: Lifeform Technologiess (active)',
                        points: total.lifeformTechnologiesActive,
                    },
                    {
                        label: 'LOCA: Lifeform Technologiess (inactive)',
                        points: total.lifeformTechnologiesInactive,
                    },
                );
            };

            result.push(
                {
                    label: 'LOCA: Moon Buildings',
                    points: total.moonBuildings,
                },
                {
                    label: 'LOCA: Research',
                    points: total.research,
                },
                {
                    label: 'LOCA: Defense',
                    points: total.defense,
                },
                {
                    label: 'LOCA: Ships',
                    points: total.ships,
                },
            );

            return result;
        }

        private get planetPointDistributions(): PlanetPointDistributionItem[] {
            const planets = Object.values(EmpireDataModule.empire.planets).filter(p => !p.isMoon) as PlanetData[];
            return planets.map<PlanetPointDistributionItem>(planet => ({
                planetId: planet.id,

                productionBuildings: this.getProductionBuildingPoints(planet),
                otherBuildings: this.getOtherPlanetBuildingPoints(planet),

                lifeformBuildingsActive: this.getOtherLifeformBuildingPoints(planet, true),
                lifeformBuildingsInactive: this.getOtherLifeformBuildingPoints(planet, false),
                lifeformTechnologiesActive: 0,
                lifeformTechnologiesInactive: 0,

                defense: 0,
                ships: 0,
            }));
        }


        private getOtherLifeformBuildingPoints(planet: PlanetData, active: boolean): number {
            const allLifeformBuildingTypes = active
                ? LifeformBuildingTypesByLifeform[planet.activeLifeform]
                : LifeformBuildingTypes.filter(b => !LifeformBuildingTypesByLifeform[planet.activeLifeform].includes(b));
            const exclude = ResourceProductionBonusLifeformBuildings.map(b => b.type);

            const lfBuildingTypes = allLifeformBuildingTypes.filter(type => !exclude.includes(type));

            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
            lfBuildingTypes.forEach((type) => {
                const building = LifeformBuildingsByType[type];

                for (let level = 1; level <= planet.lifeformBuildings[type]; level++) {
                    cost = addCost(cost, building.getCost(level));
                }
            }, 0);

            return this.getPoints(cost);
        }

        private getOtherPlanetBuildingPoints(planet: PlanetData): number {
            const mines = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];
            const buildings = PlanetBuildingTypes.filter(p => !mines.includes(p));

            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            buildings.forEach((buildingType) => {
                const building = BuildingsByType[buildingType];
                for (let level = 1; level <= planet.buildings[buildingType]; level++) {
                    cost = addCost(cost, building.getCost(level));
                }
            });

            return this.getPoints(cost);
        }

        private getProductionBuildingPoints(planet: PlanetData): number {
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            const mines: PlanetBuildingType[] = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];
            mines.forEach((mine) => {
                const building = BuildingsByType[mine];
                for (let level = 1; level <= planet.buildings[mine]; level++) {
                    cost = addCost(cost, building.getCost(level));
                }
            });

            const lifeformProductionBuildings = ResourceProductionBonusLifeformBuildings;
            lifeformProductionBuildings.forEach((lfBuilding) => {
                for (let level = 1; level <= planet.lifeformBuildings[lfBuilding.type]; level++) {
                    cost = addCost(cost, lfBuilding.getCost(level));
                }
            });

            return this.getPoints(cost);
        }

        private getMoonBuildingPoints(moon: MoonData): number {
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            MoonBuildingTypes.forEach(buildingType => {
                const building = BuildingsByType[buildingType];
                for (let level = 1; level <= moon.buildings[buildingType]; level++) {
                    cost = addCost(cost, building.getCost(level));
                }
            });

            return this.getPoints(cost);
        }

        private get moonPointDistributions(): MoonPointDistributionItem[] {
            const moons = Object.values(EmpireDataModule.empire.planets).filter(p => p.isMoon) as MoonData[];
            return moons.map<MoonPointDistributionItem>(moon => ({
                moonId: moon.id,

                buildings: this.getMoonBuildingPoints(moon),
                defense: 0,
                ships: 0,
            }));
        }

        private get researchPoints(): number {
            const researchLevels = EmpireDataModule.empire.research;
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            ResearchTypes.forEach((researchType) => {
                const research = ResearchByTypes[researchType];
                for (let level = 1; level <= researchLevels[researchType]; level++) {
                    cost = addCost(cost, research.getCost(level));
                }
            });

            return this.getPoints(cost);
        }

        private getPoints(cost: Cost): number {
            return (cost.metal + cost.crystal + cost.deuterium) / 1_000;
        }
    }
</script>
