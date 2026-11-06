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
        <grid-table :columns="columns" :items="highscoreItems" :footerItems="highscoreFooterItems" inline>
            <template #cell-points="{ value }">
                <decimal-number :value="value" />
            </template>
            <template #footer-points="{ value }">
                <decimal-number :value="value" />
            </template>
        </grid-table>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MoonData } from '@ogame-tracker/shared/models/empire/MoonData';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import type { PlanetDataBase } from '@ogame-tracker/shared/models/empire/PlanetDataBase';
import { BuildingType } from '@ogame-tracker/shared/models/ogame/buildings/BuildingType';
import { MoonBuildingTypes } from '@ogame-tracker/shared/models/ogame/buildings/BuildingTypes';
import { BuildingsByType, PlanetBuildingTypes } from '@ogame-tracker/shared/models/ogame/buildings/BuildingTypes';
import { SensorPhalanx } from '@ogame-tracker/shared/models/ogame/buildings/SensorPhalanx';
import { coordinatesEqual } from '@ogame-tracker/shared/models/ogame/common/Coordinates';
import { addCost, multiplyCost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import type { Cost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import { DefenseByTypes, DefenseTypes } from '@ogame-tracker/shared/models/ogame/defenses/DefenseTypes';
import { FleetMissionType } from '@ogame-tracker/shared/models/ogame/fleets/FleetMissionType';
import type { Fleet } from '@ogame-tracker/shared/models/ogame/fleets/types';
import { LifeformBuildingsByType, ResourceProductionBonusLifeformBuildings } from '@ogame-tracker/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
import { LifeformBuildingTypes, LifeformBuildingTypesByLifeform } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBuildingType';
import { LifeformTechnologyTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { LifeformTechnologiesByType } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
import { ResearchByTypes, ResearchTypes } from '@ogame-tracker/shared/models/ogame/research/ResearchTypes';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import { CivilShipTypes, MilitaryShipTypes, MoonShipTypes, NonStationaryShipTypes, PlanetShipTypes, ShipByTypes } from '@ogame-tracker/shared/models/ogame/ships/ShipTypes';
import type { GridTableColumn } from '../../components/common/GridTable.vue';
import { useEmpireStore } from '../../data/EmpireDataModule';
import { useLifeformDiscoveryStore } from '../../data/LifeformDiscoveryDataModule';
import { useServerSettingsStore } from '../../data/ServerSettingsDataModule';

interface PlanetPointDistributionItem {
    planetId: number;

    buildings: number;
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

const serverSettingsStore = useServerSettingsStore();

const empireStore = useEmpireStore();

const lifeformDiscoveryStore = useLifeformDiscoveryStore();

const columns = computed<GridTableColumn<keyof PointDistributionRow>[]>(() => {
    return [
        { key: 'label', label: 'LOCA: Category' },
        { key: 'points', label: 'LOCA: Points' },
    ];
});

const pointDistribution = computed(() => {
    const localResearchPoints = researchPoints.value;

    const total = {
        research: localResearchPoints,

        planetBuildings: 0,
        moonBuildings: 0,

        lifeformBuildingsActive: 0,
        lifeformBuildingsInactive: 0,
        lifeformTechnologiesActive: 0,
        lifeformTechnologiesInactive: 0,

        defense: 0,
        ships: 0,
        shipsInTransit: fleetsShipPoints.value,

        total: localResearchPoints,
    };

    planetPointDistributions.value.forEach(planet => {
        total.planetBuildings += planet.buildings;

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

    moonPointDistributions.value.forEach(moon => {
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
});

const highscorePoints = computed(() => {
    return {
        economy: getEconomyPoints(),
        research: researchPoints.value,
        military: getMilitaryPoints(),
        lifeforms: getLifeformPoints(),
    };
});

const highscoreItems = computed<PointDistributionRow[]>(() => {
    const { economy, research, military, lifeforms } = highscorePoints.value;

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

    if (serverSettingsStore.serverSettings.lifeforms.enabled) {
        result.push({
            label: 'LOCA: Lifeforms',
            points: lifeforms,
        });
    };

    return result;
});

const highscoreFooterItems = computed<PointDistributionRow[]>(() => {
    const total = Object.values(highscorePoints.value).reduce((total, points) => total + points, 0); //TODO: dont include defenses twice

    return [{
        label: 'LOCA: Total Points',
        points: total,
    }];
});

const items = computed<PointDistributionRow[]>(() => {
    const total = pointDistribution.value;

    const result: PointDistributionRow[] = [
        {
            label: 'LOCA: Planet Buildings',
            points: total.planetBuildings,
        },
    ];

    if (serverSettingsStore.serverSettings.lifeforms.enabled) {
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
});

const footerItems = computed<PointDistributionRow[]>(() => {
    return [{
        label: 'LOCA: Actual Total Points',
        points: pointDistribution.value.total,
    }];
});

const planets = computed(() => planetAndMoons.value.filter(p => !p.isMoon) as PlanetData[]);

const planetAndMoons = computed(() => Object.values(empireStore.empire.planets));

function getLifeformPoints(): number {
    const buildingPoints = planets.value.reduce((total, planet) => {
        const points = LifeformBuildingTypes.reduce((total, buildingType) => {
            const lfBuilding = LifeformBuildingsByType[buildingType];
            const cost = getAccumulativeCost(planet.lifeformBuildings[buildingType], lfBuilding);

            return total + getPoints(cost);
        }, 0);

        return total + points;
    }, 0);

    const technologyPoints = planets.value.reduce((total, planet) => {
        const points = LifeformTechnologyTypes.reduce((total, technologyType) => {
            const lfTech = LifeformTechnologiesByType[technologyType];
            const cost = getAccumulativeCost(planet.lifeformTechnologies[technologyType], lfTech);

            return total + getPoints(cost);
        }, 0);

        return total + points;
    }, 0);

    const lifeformDiscoveries = Object.values(lifeformDiscoveryStore.lifeforms).reduce((total, info) => total + info.discoveriesCount, 0);

    return buildingPoints + technologyPoints + lifeformDiscoveries;
}

function getEconomyPoints(): number {
    const defense = planets.value.reduce((total, planet) => total + getDefensePoints(planet), 0);

    const phalanxesAndJumpGates = (planetAndMoons.value.filter(p => p.isMoon) as MoonData[])
        .reduce((total, moon) => {
            const phalanx = getAccumulativeCost(moon.buildings[BuildingType.sensorPhalanx], SensorPhalanx);
            const jumpGate = getAccumulativeCost(moon.buildings[BuildingType.jumpGate], SensorPhalanx);

            const points = getPoints(phalanx) + getPoints(jumpGate);
            return total + points;
        }, 0);

    const civilShipTypes = NonStationaryShipTypes.filter(shipType => (CivilShipTypes as ShipType[]).includes(shipType));
    const civilShips = planetAndMoons.value.reduce((total, planet) => {
        let points: number;

        if (planet.isMoon) {
            points = MoonShipTypes
                .filter(ship => (CivilShipTypes as ShipType[]).includes(ship))
                .reduce((total, shipType) => {
                    const ship = ShipByTypes[shipType];
                    const cost = multiplyCost(ship.cost, planet.ships[shipType]);

                    return total + getPoints(cost);
                }, 0);
        }
        else {
            points = PlanetShipTypes
                .filter(ship => (CivilShipTypes as ShipType[]).includes(ship))
                .reduce((total, shipType) => {
                    const ship = ShipByTypes[shipType];
                    const cost = multiplyCost(ship.cost, planet.ships[shipType]);

                    return total + getPoints(cost);
                }, 0);
        }

        return total + points;
    }, 0) + ownReturningFleets.value.reduce((total, fleet) => {
        const points = civilShipTypes.reduce((total, shipType) => {
            const count = fleet.ships[shipType];
            const ship = ShipByTypes[shipType];

            const cost = multiplyCost(ship.cost, count);
            return total + getPoints(cost);
        }, 0);

        return total + points;
    }, 0);

    const buildings = planetAndMoons.value
        .reduce((total, planet) => {
            let points: number;

            if (planet.isMoon) {
                points = MoonBuildingTypes.reduce((total, type) => {
                    const building = BuildingsByType[type];
                    const level = planet.buildings[type];
                    const cost = getAccumulativeCost(level, building);

                    return total + getPoints(cost);
                }, 0);
            }
            else {
                points = PlanetBuildingTypes.reduce((total, type) => {
                    const building = BuildingsByType[type];
                    const level = planet.buildings[type];
                    const cost = getAccumulativeCost(level, building);

                    return total + getPoints(cost);
                }, 0);
            }

            return total + points;
        }, 0);

    return defense + buildings + phalanxesAndJumpGates / 2 + civilShips / 2;
}

function getMilitaryPoints(): number {
    const defense = planets.value.reduce((total, planet) => total + getDefensePoints(planet), 0);

    const phalanxesAndJumpGates = (planetAndMoons.value.filter(p => p.isMoon) as MoonData[])
        .reduce((total, moon) => {
            const phalanx = getAccumulativeCost(moon.buildings[BuildingType.sensorPhalanx], SensorPhalanx);
            const jumpGate = getAccumulativeCost(moon.buildings[BuildingType.jumpGate], SensorPhalanx);

            const points = getPoints(phalanx) + getPoints(jumpGate);
            return total + points;
        }, 0);

    const militaryShipTypes = NonStationaryShipTypes.filter(shipType => (MilitaryShipTypes as ShipType[]).includes(shipType));
    const militaryShips = planetAndMoons.value.reduce((total, planet) => {
        let points: number;

        if (planet.isMoon) {
            points = MoonShipTypes
                .filter(ship => (MilitaryShipTypes as ShipType[]).includes(ship))
                .reduce((total, shipType) => {
                    const ship = ShipByTypes[shipType];
                    const cost = multiplyCost(ship.cost, planet.ships[shipType]);

                    return total + getPoints(cost);
                }, 0);
        }
        else {
            points = PlanetShipTypes
                .filter(ship => (MilitaryShipTypes as ShipType[]).includes(ship))
                .reduce((total, shipType) => {
                    const ship = ShipByTypes[shipType];
                    const cost = multiplyCost(ship.cost, planet.ships[shipType]);

                    return total + getPoints(cost);
                }, 0);
        }

        return total + points;
    }, 0) + ownReturningFleets.value.reduce((total, fleet) => {
        const points = militaryShipTypes.reduce((total, shipType) => {
            const count = fleet.ships[shipType];
            const ship = ShipByTypes[shipType];

            const cost = multiplyCost(ship.cost, count);
            return total + getPoints(cost);
        }, 0);

        return total + points;
    }, 0);

    const civilShipTypes = NonStationaryShipTypes.filter(shipType => (CivilShipTypes as ShipType[]).includes(shipType));
    const civilShips = planetAndMoons.value.reduce((total, planet) => {
        let points: number;

        if (planet.isMoon) {
            points = MoonShipTypes
                .filter(ship => (CivilShipTypes as ShipType[]).includes(ship))
                .reduce((total, shipType) => {
                    const ship = ShipByTypes[shipType];
                    const cost = multiplyCost(ship.cost, planet.ships[shipType]);

                    return total + getPoints(cost);
                }, 0);
        }
        else {
            points = PlanetShipTypes
                .filter(ship => (CivilShipTypes as ShipType[]).includes(ship))
                .reduce((total, shipType) => {
                    const ship = ShipByTypes[shipType];
                    const cost = multiplyCost(ship.cost, planet.ships[shipType]);

                    return total + getPoints(cost);
                }, 0);
        }

        return total + points;
    }, 0) + ownReturningFleets.value.reduce((total, fleet) => {
        const points = civilShipTypes.reduce((total, shipType) => {
            const count = fleet.ships[shipType];
            const ship = ShipByTypes[shipType];

            const cost = multiplyCost(ship.cost, count);
            return total + getPoints(cost);
        }, 0);

        return total + points;
    }, 0);

    return defense + phalanxesAndJumpGates / 2 + militaryShips + civilShips / 2;
}

const planetPointDistributions = computed<PlanetPointDistributionItem[]>(() => {
    return planets.value.map<PlanetPointDistributionItem>(planet => ({
        planetId: planet.id,

        buildings: getPlanetBuildingPoints(planet),

        lifeformBuildingsActive: getOtherLifeformBuildingPoints(planet, true),
        lifeformBuildingsInactive: getOtherLifeformBuildingPoints(planet, false),
        lifeformTechnologiesActive: getLifeformTechnologyPoints(planet, true),
        lifeformTechnologiesInactive: getLifeformTechnologyPoints(planet, false),

        defense: getDefensePoints(planet),
        ships: getPlanetShipPoints(planet),
    }));
});

function getLifeformTechnologyPoints(planet: PlanetData, active: boolean): number {
    const lifeformTechnologyTypes = LifeformTechnologyTypes.filter(type => planet.activeLifeformTechnologies.includes(type) == active);

    let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    lifeformTechnologyTypes.forEach((type) => {
        const technology = LifeformTechnologiesByType[type];
        cost = addCost(cost, getAccumulativeCost(planet.lifeformTechnologies[type], technology));
    }, 0);

    return getPoints(cost);
}

const moonPointDistributions = computed<MoonPointDistributionItem[]>(() => {
    const moons = Object.values(empireStore.empire.planets).filter(p => p.isMoon) as MoonData[];
    return moons.map<MoonPointDistributionItem>(moon => ({
        moonId: moon.id,

        buildings: getMoonBuildingPoints(moon),
        defense: getDefensePoints(moon),
        ships: getMoonShipPoints(moon),
    }));
});

const researchPoints = computed<number>(() => {
    const researchLevels = empireStore.empire.research;
    let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

    ResearchTypes.forEach((researchType) => {
        const research = ResearchByTypes[researchType];
        cost = addCost(cost, getAccumulativeCost(researchLevels[researchType], research));
    });

    return getPoints(cost);
});

function toNumber(value: number | boolean): number {
    if (typeof value === 'boolean') {
        return value ? 1 : 0;
    }

    return value;
}

function getDefensePoints(planet: PlanetDataBase): number {
    let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

    DefenseTypes.forEach(defenseType => {
        const count = toNumber(planet.defense[defenseType]);
        const defense = DefenseByTypes[defenseType];

        const totalCost = multiplyCost(defense.cost, count);
        cost = addCost(cost, totalCost);
    });

    return getPoints(cost);
}

const ownReturningFleets = computed<Fleet[]>(() => {
    const fleets = empireStore.empire.fleets;
    const localPlanets = planetAndMoons.value;
    return fleets.filter(fleet =>
        (
            fleet.isReturnFlight
            || fleet.mission == FleetMissionType.deployment
        ) && localPlanets.some(p => coordinatesEqual(p.coordinates, fleet.originCoordinates))
    );
});

const fleetsShipPoints = computed<number>(() => {
    let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

    ownReturningFleets.value.forEach(fleet => {
        NonStationaryShipTypes.forEach(shipType => {
            const count = fleet.ships[shipType];
            const ship = ShipByTypes[shipType];

            const totalCost = multiplyCost(ship.cost, count);
            cost = addCost(cost, totalCost);
        });
    });

    return getPoints(cost);
});

function getPlanetShipPoints(planet: PlanetData): number {
    let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

    PlanetShipTypes
        .forEach(shipType => {
            const count = planet.ships[shipType];
            const ship = ShipByTypes[shipType];

            const totalCost = multiplyCost(ship.cost, count);
            cost = addCost(cost, totalCost);
        });

    return getPoints(cost);
}

function getMoonShipPoints(moon: MoonData): number {
    let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

    MoonShipTypes
        .forEach(shipType => {
            const count = moon.ships[shipType];
            const ship = ShipByTypes[shipType];

            const totalCost = multiplyCost(ship.cost, count);
            cost = addCost(cost, totalCost);
        });

    return getPoints(cost);
}

function getOtherLifeformBuildingPoints(planet: PlanetData, active: boolean): number {
    const allLifeformBuildingTypes = active
        ? LifeformBuildingTypesByLifeform[planet.activeLifeform]
        : LifeformBuildingTypes.filter(b => !LifeformBuildingTypesByLifeform[planet.activeLifeform].includes(b));
    const exclude = ResourceProductionBonusLifeformBuildings.map(b => b.type);

    const lfBuildingTypes = allLifeformBuildingTypes.filter(type => !exclude.includes(type));

    let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    lfBuildingTypes.forEach((type) => {
        const building = LifeformBuildingsByType[type];
        cost = addCost(cost, getAccumulativeCost(planet.lifeformBuildings[type], building));
    }, 0);

    return getPoints(cost);
}

function getAccumulativeCost(level: number, buildable: { getCost(level: number): Cost }): Cost {
    let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

    for (let l = 1;l <= level;l++) {
        cost = addCost(cost, buildable.getCost(l));
    }

    return cost;
}

function getPlanetBuildingPoints(planet: PlanetData): number {
    let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

    PlanetBuildingTypes.forEach((mine) => {
        const building = BuildingsByType[mine];
        cost = addCost(cost, getAccumulativeCost(planet.buildings[mine], building));
    });

    return getPoints(cost);
}

function getMoonBuildingPoints(moon: MoonData): number {
    let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

    MoonBuildingTypes.forEach(buildingType => {
        const building = BuildingsByType[buildingType];
        cost = addCost(cost, getAccumulativeCost(moon.buildings[buildingType], building));
    });

    return getPoints(cost);
}

function getPoints(cost: Cost): number {
    return (cost.metal + cost.crystal + cost.deuterium) / 1_000;
}
</script>
