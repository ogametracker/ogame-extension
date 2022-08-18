<template>
    <div class="point-distribution">
        <grid-table :columns="columns" :items="items" inline>
            <template #cell-points="{ value }">
                <span v-text="$i18n.$n(value)" />
            </template>
        </grid-table>
    </div>
</template>

<script lang="ts">
    import { MoonData } from '@/shared/models/empire/MoonData';
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { BuildingsByType, BuildingType, MoonBuildingTypes, PlanetBuildingType, PlanetBuildingTypes } from '@/shared/models/ogame/buildings/BuildingType';
    import { Cost } from '@/shared/models/ogame/common/Cost';
    import { LifeformBuildingsByType, ResourceProductionBonusLifeformBuildings } from '@/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
import { LifeformBuildingTypes } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GridTableColumn } from '../../components/common/GridTable.vue';
    import { EmpireDataModule } from '../../data/EmpireDataModule';

    interface PlanetPointDistributionItem {
        planetId: number;

        productionBuildings: number;
        otherBuildings: number;

        lifeformBuildings: number;
        lifeformTechnologies: number;

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

        private get items(): PointDistributionRow[] {
            const total = {
                research: this.researchPoints,

                productionBuildings: 0,
                planetBuildings: 0,
                moonBuildings: 0,

                lifeformBuildings: 0,
                lifeformTechnologies: 0,

                defense: 0,
                ships: 0,
            };

            this.planetPointDistributions.forEach(planet => {
                total.productionBuildings += planet.productionBuildings;
                total.planetBuildings += planet.otherBuildings;

                total.lifeformBuildings += planet.lifeformBuildings;
                total.lifeformTechnologies += planet.lifeformTechnologies;

                total.defense += planet.defense;
                total.ships += planet.ships;
            });

            this.moonPointDistributions.forEach(moon => {
                total.moonBuildings += moon.buildings;

                total.defense += moon.defense;
                total.ships += moon.ships;
            })

            return [
                {
                    label: 'LOCA: Production Buildings (Mines + LF Production Buildings)',
                    points: Math.floor(total.productionBuildings),
                },
                {
                    label: 'LOCA: Planet Buildings',
                    points: Math.floor(total.planetBuildings),
                },
                {
                    label: 'LOCA: Lifeform Buildings',
                    points: Math.floor(total.lifeformBuildings),
                },
                {
                    label: 'LOCA: Lifeform Technologies',
                    points: Math.floor(total.lifeformTechnologies),
                },
                {
                    label: 'LOCA: Moon Buildings',
                    points: Math.floor(total.moonBuildings),
                },
                {
                    label: 'LOCA: Research',
                    points: Math.floor(total.research),
                },
                {
                    label: 'LOCA: Defense',
                    points: Math.floor(total.defense),
                },
                {
                    label: 'LOCA: Ships',
                    points: Math.floor(total.ships),
                },
            ];
        }

        private get planetPointDistributions(): PlanetPointDistributionItem[] {
            const planets = Object.values(EmpireDataModule.empire.planets).filter(p => !p.isMoon) as PlanetData[];
            return planets.map<PlanetPointDistributionItem>(planet => ({
                planetId: planet.id,

                productionBuildings: this.getProductionBuildingPoints(planet),
                otherBuildings: this.getOtherPlanetBuildingPoints(planet),

                lifeformBuildings: this.getOtherLifeformBuildingPoints(planet),
                lifeformTechnologies: 0,

                defense: 0,
                ships: 0,
            }));
        }

        
        private getOtherLifeformBuildingPoints(planet: PlanetData): number {
            const exclude = ResourceProductionBonusLifeformBuildings.map(b => b.type);
            const lfBuildingTypes = LifeformBuildingTypes.filter(type => !exclude.includes(type));

            return lfBuildingTypes.reduce((total, type) => {
                let points = 0;
                const building = LifeformBuildingsByType[type];

                for(let level = 1; level <= planet.lifeformBuildings[type]; level++) {
                    points += this.getPoints(building.getCost(level));
                }

                return total + points;
            }, 0);
        }

        private getOtherPlanetBuildingPoints(planet: PlanetData): number {
            const mines = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];
            const buildings = PlanetBuildingTypes.filter(p => !mines.includes(p));

            return buildings.reduce((total, buildingType) => {
                const building = BuildingsByType[buildingType];
                let points = 0;
                for (let level = 1; level <= planet.buildings[buildingType]; level++) {
                    points += this.getPoints(building.getCost(level));
                }

                return total + points;
            }, 0);
        }

        private getProductionBuildingPoints(planet: PlanetData): number {
            const mines: PlanetBuildingType[] = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];
            const minePoints = mines.reduce((total, mine) => {
                const building = BuildingsByType[mine];
                let points = 0;
                for (let level = 1; level <= planet.buildings[mine]; level++) {
                    points += this.getPoints(building.getCost(level));
                }

                return total + points;
            }, 0);

            const lifeformProductionBuildings = ResourceProductionBonusLifeformBuildings;
            const lfProductionBuildingsPoints = lifeformProductionBuildings.reduce((total, lfBuilding) => {
                let points = 0;
                for(let level = 1; level <= planet.lifeformBuildings[lfBuilding.type]; level++) {
                    points += this.getPoints(lfBuilding.getCost(level));
                }

                return total + points;
            }, 0);

            return minePoints + lfProductionBuildingsPoints;
        }

        private getMoonBuildingPoints(moon: MoonData): number {
            return MoonBuildingTypes.reduce((total, buildingType) => {
                const building = BuildingsByType[buildingType];
                let points = 0;
                for (let level = 1; level <= moon.buildings[buildingType]; level++) {
                    points += this.getPoints(building.getCost(level));
                }

                return total + points;
            }, 0);
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
            return 0;
        }

        private getPoints(cost: Cost): number {
            return (cost.metal + cost.crystal + cost.deuterium) / 1_000;
        }
    }
</script>
