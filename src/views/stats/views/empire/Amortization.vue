<template>
    <div>
        <div v-for="(building, i) in amortizationOrder" :key="i">
            <span v-text="`${building.building}: `" />
            <span v-text="building.level" />
            <span v-text="`(${building.planetId})`" />
        </div>
    </div>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/v1/empire/PlanetData';
    import { BuildingType } from '@/shared/models/v1/ogame/buildings/BuildingType';
    import { CrystalMine } from '@/shared/models/v1/ogame/buildings/CrystalMine';
    import { DeuteriumSynthesizer } from '@/shared/models/v1/ogame/buildings/DeuteriumSynthesizer';
    import { MetalMine } from '@/shared/models/v1/ogame/buildings/MetalMine';
    import { ProductionBuilding, ProductionBuildingDependencies } from '@/shared/models/v1/ogame/buildings/ProductionBuilding';
    import { addCost, Cost } from '@/shared/models/v1/ogame/common/Cost';
    import { ResearchType } from '@/shared/models/v1/ogame/research/ResearchType';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { EmpireDataModule } from '../../data/EmpireDataModule';
    import { Astrophysics } from '@/shared/models/v1/ogame/research/Astrophysics';

    interface AmortizationBuildingItem {
        planetId: number;

        building: BuildingType;
        level: number;
        timeInHours: number;
        cost: Cost;

        production: number;
        productionMsu: number;
    }

    @Component({})
    export default class Amortization extends Vue {
        private readonly maxMineLevel = 70; //TODO: setting?

        private readonly amortizationOrder: AmortizationBuildingItem[] = [];

        private mounted() {
            const player = EmpireDataModule.empire;
            const planets = Object.values(EmpireDataModule.empire.planets).filter(p => !p.isMoon) as PlanetData[];

            const economySpeed = 8; //TODO: from server settings


            const buildingItems = {
                metal: [] as AmortizationBuildingItem[][],
                crystal: [] as AmortizationBuildingItem[][],
                deuterium: [] as AmortizationBuildingItem[][],
            };

            planets.forEach(planet => {
                const dependencies: ProductionBuildingDependencies = {
                    economySpeed,
                    planet,
                    player,
                };

                const levelMetalMine = planet.buildings.production[BuildingType.metalMine];
                buildingItems.metal.push(this.getAmortizationBuildingItems(levelMetalMine, BuildingType.metalMine, MetalMine, dependencies));

                const levelCrystalMine = planet.buildings.production[BuildingType.crystalMine];
                buildingItems.crystal.push(this.getAmortizationBuildingItems(levelCrystalMine, BuildingType.crystalMine, CrystalMine, dependencies));

                const levelDeutSynth = planet.buildings.production[BuildingType.deuteriumSynthesizer];
                buildingItems.deuterium.push(this.getAmortizationBuildingItems(levelDeutSynth, BuildingType.deuteriumSynthesizer, DeuteriumSynthesizer, dependencies));
            });


            while (true) {
                const metalMine = this.getNextBuilding(buildingItems.metal);
                const crystalMine = this.getNextBuilding(buildingItems.crystal);
                const deutSynth = this.getNextBuilding(buildingItems.deuterium);

                const order = ([metalMine, crystalMine, deutSynth].filter(b => b != null) as AmortizationBuildingItem[])
                    .sort((a, b) => a.timeInHours - b.timeInHours);
                const winner = order[0];
                if (winner == null) {
                    break;
                }

                this.amortizationOrder.push(winner);

                if (winner.building == BuildingType.metalMine) {
                    buildingItems.metal = buildingItems.metal.map(items => items.filter(item => item != winner));
                } else if (winner.building == BuildingType.crystalMine) {
                    buildingItems.crystal = buildingItems.crystal.map(items => items.filter(item => item != winner));
                } else if (winner.building == BuildingType.deuteriumSynthesizer) {
                    buildingItems.deuterium = buildingItems.deuterium.map(items => items.filter(item => item != winner));
                }
            }

            console.debug('amortization order', this.amortizationOrder);
        }

        private getNextBuilding(items: AmortizationBuildingItem[][]): AmortizationBuildingItem | null {
            if (items.every(arr => arr.length == 0)) {
                return null;
            }

            return items.reduce((acc, itemArray) => {
                const item = itemArray[0] as AmortizationBuildingItem | undefined;
                if (item == null) {
                    return acc;
                }

                if (acc == null || item.timeInHours < acc.timeInHours) {
                    return item;
                }

                return acc;
            }, null as AmortizationBuildingItem | null);
        }

        private getMsu(cost: Cost): number {
            return cost.metal + cost.crystal * 2 + cost.deuterium * 3; //TODO: MSU from settings
        }

        private getAmortizationBuildingItems(currentLevel: number, buildingType: BuildingType, building: ProductionBuilding, dependencies: ProductionBuildingDependencies): AmortizationBuildingItem[] {
            const result: AmortizationBuildingItem[] = [];

            const curProduction = building.getProduction(currentLevel, dependencies);
            let curProductionMsu = this.getMsu(curProduction);

            for (let level = currentLevel + 1; level <= this.maxMineLevel; level++) {
                const cost = building.getCost(level);
                const msuCost = this.getMsu(cost);

                const production = building.getProduction(level, dependencies);
                const productionMsu = this.getMsu(production);

                const timeInHours = msuCost / (productionMsu - curProductionMsu);

                result.push({
                    planetId: dependencies.planet.id,

                    building: buildingType,
                    level,
                    cost,
                    production: Math.max(production.metal, production.crystal, production.deuterium),
                    productionMsu,
                    timeInHours,
                });

                curProductionMsu = productionMsu;
            }

            return result;
        }
    }
</script>