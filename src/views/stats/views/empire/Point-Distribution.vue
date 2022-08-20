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
        <grid-table :columns="columns" :items="highscoreItems" inline>
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
    import { PlanetDataBase } from '@/shared/models/empire/PlanetDataBase';
    import { BuildingType, PlanetBuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { MoonBuildingTypes } from '@/shared/models/ogame/buildings/BuildingTypes';
    import { BuildingsByType, PlanetBuildingTypes } from '@/shared/models/ogame/buildings/BuildingTypes';
    import { SensorPhalanx } from '@/shared/models/ogame/buildings/SensorPhalanx';
    import { compareCoordinates } from '@/shared/models/ogame/common/Coordinates';
    import { addCost, Cost, multiplyCost } from '@/shared/models/ogame/common/Cost';
    import { DefenseByTypes, DefenseTypes } from '@/shared/models/ogame/defenses/DefenseTypes';
    import { Fleets } from '@/shared/models/ogame/fleets/types';
    import { LifeformBuildingsByType, ResourceProductionBonusLifeformBuildings } from '@/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
    import { LifeformBuildingTypes, LifeformBuildingTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { ResearchByTypes, ResearchTypes } from '@/shared/models/ogame/research/ResearchTypes';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { CivilShipTypes, MilitaryShipTypes, MoonShipTypes, NonStationaryShipTypes, PlanetShipTypes, ShipByTypes } from '@/shared/models/ogame/ships/ShipTypes';
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
                { key: 'label', label: 'LOCA: Category' },
                { key: 'points', label: 'LOCA: Points' },
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
                shipsInTransit: this.getFleetsShipPoints(EmpireDataModule.empire.fleets),

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

        private get highscoreItems(): PointDistributionRow[] {
            const economy = this.getEconomyPoints();
            const research = this.researchPoints;
            const military = this.getMilitaryPoints();

            const result: PointDistributionRow[] = [
                {
                    label: 'LOCA: Economy',
                    points: economy,
                },
                {
                    label: 'LOCA: Research',
                    points: research,
                },
                {
                    label: 'LOCA: Military',
                    points: military,
                },
            ];

            if (ServerSettingsDataModule.serverSettings.lifeforms.enabled) {
                const lifeforms = this.getLifeformPoints();

                result.push(
                    {
                        label: 'LOCA: Lifeforms',
                        points: lifeforms,
                    },
                );
            };

            return result;
        }

        private get items(): PointDistributionRow[] {
            const total = this.pointDistribution;

            const result: PointDistributionRow[] = [
                {
                    label: 'LOCA: Production Buildings',
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
                {
                    label: 'LOCA: Ships in transit',
                    points: total.shipsInTransit,
                },
            );

            return result;
        }

        private get planets() {
            return this.planetAndMoons.filter(p => !p.isMoon) as PlanetData[];
        }

        private get planetAndMoons() {
            return Object.values(EmpireDataModule.empire.planets);
        }

        private getLifeformPoints(): number {
            const buildingPoints = this.planets.reduce((total, planet) => {
                const points = LifeformBuildingTypes.reduce((total, buildingType) => {
                    const lfBuilding = LifeformBuildingsByType[buildingType];
                    const cost = this.getAccumulativeCost(planet.lifeformBuildings[buildingType], lfBuilding);

                    return total + this.getPoints(cost);
                }, 0);

                return total + points;
            }, 0);

            //TODO: technology points

            return buildingPoints;
        }

        private getEconomyPoints(): number {
            const defense = this.planets.reduce((total, planet) => total + this.getDefensePoints(planet), 0);

            const phalanxesAndJumpGates = (this.planetAndMoons.filter(p => p.isMoon) as MoonData[])
                .reduce((total, moon) => {
                    const phalanx = this.getAccumulativeCost(moon.buildings[BuildingType.sensorPhalanx], SensorPhalanx);
                    const jumpGate = this.getAccumulativeCost(moon.buildings[BuildingType.jumpGate], SensorPhalanx);

                    const points = this.getPoints(phalanx) + this.getPoints(jumpGate);
                    return total + points;
                }, 0);

            const civilShips = this.planetAndMoons.reduce((total, planet) => {
                let points: number;

                if (planet.isMoon) {
                    points = MoonShipTypes
                        .filter(ship => (CivilShipTypes as ShipType[]).includes(ship))
                        .reduce((total, shipType) => {
                            const ship = ShipByTypes[shipType];
                            const cost = multiplyCost(ship.getCost(), planet.ships[shipType]);

                            return total + this.getPoints(cost);
                        }, 0);
                }
                else {
                    points = PlanetShipTypes
                        .filter(ship => (CivilShipTypes as ShipType[]).includes(ship))
                        .reduce((total, shipType) => {
                            const ship = ShipByTypes[shipType];
                            const cost = multiplyCost(ship.getCost(), planet.ships[shipType]);

                            return total + this.getPoints(cost);
                        }, 0);
                }

                return total + points;
            }, 0);

            const buildings = this.planetAndMoons
                .reduce((total, planet) => {
                    let points: number;

                    if (planet.isMoon) {
                        points = MoonBuildingTypes.reduce((total, type) => {
                            const building = BuildingsByType[type];
                            const level = planet.buildings[type];
                            const cost = this.getAccumulativeCost(level, building);

                            return total + this.getPoints(cost);
                        }, 0);
                    }
                    else {
                        points = PlanetBuildingTypes.reduce((total, type) => {
                            const building = BuildingsByType[type];
                            const level = planet.buildings[type];
                            const cost = this.getAccumulativeCost(level, building);

                            return total + this.getPoints(cost);
                        }, 0);
                    }

                    return total + points;
                }, 0);

            return defense + buildings + phalanxesAndJumpGates / 2 + civilShips / 2;
        }

        private getMilitaryPoints(): number {
            const defense = this.planets.reduce((total, planet) => total + this.getDefensePoints(planet), 0);

            const phalanxesAndJumpGates = (this.planetAndMoons.filter(p => p.isMoon) as MoonData[])
                .reduce((total, moon) => {
                    const phalanx = this.getAccumulativeCost(moon.buildings[BuildingType.sensorPhalanx], SensorPhalanx);
                    const jumpGate = this.getAccumulativeCost(moon.buildings[BuildingType.jumpGate], SensorPhalanx);

                    const points = this.getPoints(phalanx) + this.getPoints(jumpGate);
                    return total + points;
                }, 0);

            const militaryShips = this.planetAndMoons.reduce((total, planet) => {
                let points: number;

                if (planet.isMoon) {
                    points = MoonShipTypes
                        .filter(ship => (MilitaryShipTypes as ShipType[]).includes(ship))
                        .reduce((total, shipType) => {
                            const ship = ShipByTypes[shipType];
                            const cost = multiplyCost(ship.getCost(), planet.ships[shipType]);

                            return total + this.getPoints(cost);
                        }, 0);
                }
                else {
                    points = PlanetShipTypes
                        .filter(ship => (MilitaryShipTypes as ShipType[]).includes(ship))
                        .reduce((total, shipType) => {
                            const ship = ShipByTypes[shipType];
                            const cost = multiplyCost(ship.getCost(), planet.ships[shipType]);

                            return total + this.getPoints(cost);
                        }, 0);
                }

                return total + points;
            }, 0);

            const civilShips = this.planetAndMoons.reduce((total, planet) => {
                let points: number;

                if (planet.isMoon) {
                    points = MoonShipTypes
                        .filter(ship => (CivilShipTypes as ShipType[]).includes(ship))
                        .reduce((total, shipType) => {
                            const ship = ShipByTypes[shipType];
                            const cost = multiplyCost(ship.getCost(), planet.ships[shipType]);

                            return total + this.getPoints(cost);
                        }, 0);
                }
                else {
                    points = PlanetShipTypes
                        .filter(ship => (CivilShipTypes as ShipType[]).includes(ship))
                        .reduce((total, shipType) => {
                            const ship = ShipByTypes[shipType];
                            const cost = multiplyCost(ship.getCost(), planet.ships[shipType]);

                            return total + this.getPoints(cost);
                        }, 0);
                }

                return total + points;
            }, 0);

            return defense + phalanxesAndJumpGates / 2 + militaryShips + civilShips / 2;
        }

        private get planetPointDistributions(): PlanetPointDistributionItem[] {
            return this.planets.map<PlanetPointDistributionItem>(planet => ({
                planetId: planet.id,

                productionBuildings: this.getProductionBuildingPoints(planet),
                otherBuildings: this.getOtherPlanetBuildingPoints(planet),

                lifeformBuildingsActive: this.getOtherLifeformBuildingPoints(planet, true),
                lifeformBuildingsInactive: this.getOtherLifeformBuildingPoints(planet, false),
                lifeformTechnologiesActive: 0,
                lifeformTechnologiesInactive: 0,

                defense: this.getDefensePoints(planet),
                ships: this.getPlanetShipPoints(planet),
            }));
        }

        private get moonPointDistributions(): MoonPointDistributionItem[] {
            const moons = Object.values(EmpireDataModule.empire.planets).filter(p => p.isMoon) as MoonData[];
            return moons.map<MoonPointDistributionItem>(moon => ({
                moonId: moon.id,

                buildings: this.getMoonBuildingPoints(moon),
                defense: this.getDefensePoints(moon),
                ships: this.getMoonShipPoints(moon),
            }));
        }

        private get researchPoints(): number {
            const researchLevels = EmpireDataModule.empire.research;
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            ResearchTypes.forEach((researchType) => {
                const research = ResearchByTypes[researchType];
                cost = addCost(cost, this.getAccumulativeCost(researchLevels[researchType], research));
            });

            return this.getPoints(cost);
        }

        private toNumber(value: number | boolean): number {
            if (typeof value === 'boolean') {
                return value ? 1 : 0;
            }

            return value;
        }

        private getDefensePoints(planet: PlanetDataBase): number {
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            DefenseTypes.forEach(defenseType => {
                const count = this.toNumber(planet.defense[defenseType]);
                const defense = DefenseByTypes[defenseType];

                const totalCost = multiplyCost(defense.cost, count);
                cost = addCost(cost, totalCost);
            });

            return this.getPoints(cost);
        }

        private getFleetsShipPoints(fleets: Fleets): number {
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            const planets = this.planetAndMoons;
            const ownReturningFleets = fleets.filter(fleet => fleet.isReturnFlight && planets.some(p => compareCoordinates(p.coordinates, fleet.originCoordinates) == 0));

            ownReturningFleets.forEach(fleet => {
                NonStationaryShipTypes.forEach(shipType => {
                    const count = fleet.ships[shipType];
                    const ship = ShipByTypes[shipType];

                    const totalCost = multiplyCost(ship.getCost(), count);
                    cost = addCost(cost, totalCost);
                });
            });

            return this.getPoints(cost);
        }

        private getPlanetShipPoints(planet: PlanetData): number {
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            PlanetShipTypes
                .forEach(shipType => {
                    const count = planet.ships[shipType];
                    const ship = ShipByTypes[shipType];

                    const totalCost = multiplyCost(ship.getCost(), count);
                    cost = addCost(cost, totalCost);
                });

            return this.getPoints(cost);
        }

        private getMoonShipPoints(moon: MoonData): number {
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            MoonShipTypes
                .forEach(shipType => {
                    const count = moon.ships[shipType];
                    const ship = ShipByTypes[shipType];

                    const totalCost = multiplyCost(ship.getCost(), count);
                    cost = addCost(cost, totalCost);
                });

            return this.getPoints(cost);
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
                cost = addCost(cost, this.getAccumulativeCost(planet.lifeformBuildings[type], building));
            }, 0);

            return this.getPoints(cost);
        }

        private getOtherPlanetBuildingPoints(planet: PlanetData): number {
            const mines = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];
            const buildings = PlanetBuildingTypes.filter(p => !mines.includes(p));

            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            buildings.forEach((buildingType) => {
                const building = BuildingsByType[buildingType];
                cost = addCost(cost, this.getAccumulativeCost(planet.buildings[buildingType], building));
            });

            return this.getPoints(cost);
        }

        private getAccumulativeCost(level: number, buildable: { getCost(level: number): Cost }): Cost {
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            for (let l = 1; l <= level; l++) {
                cost = addCost(cost, buildable.getCost(l));
            }

            return cost;
        }

        private getProductionBuildingPoints(planet: PlanetData): number {
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            const mines: PlanetBuildingType[] = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];
            mines.forEach((mine) => {
                const building = BuildingsByType[mine];
                cost = addCost(cost, this.getAccumulativeCost(planet.buildings[mine], building));
            });

            const lifeformProductionBuildings = ResourceProductionBonusLifeformBuildings;
            lifeformProductionBuildings.forEach((lfBuilding) => {
                cost = addCost(cost, this.getAccumulativeCost(planet.lifeformBuildings[lfBuilding.type], lfBuilding));
            });

            return this.getPoints(cost);
        }

        private getMoonBuildingPoints(moon: MoonData): number {
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            MoonBuildingTypes.forEach(buildingType => {
                const building = BuildingsByType[buildingType];
                cost = addCost(cost, this.getAccumulativeCost(moon.buildings[buildingType], building));
            });

            return this.getPoints(cost);
        }

        private getPoints(cost: Cost): number {
            return (cost.metal + cost.crystal + cost.deuterium) / 1_000;
        }
    }
</script>
