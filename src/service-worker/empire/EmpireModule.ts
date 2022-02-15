import { _log, _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { getStorageKeyPrefix } from "../../shared/utils/getStorageKeyPrefix";
import { EmpireManager } from "./EmpireManager";
import { MessageOgameMeta } from "../../shared/messages/Message";
import { LocalPlayerData } from "../../shared/models/v1/empire/LocalPlayerData";
import { PlayerOfficers } from "../../shared/models/v1/empire/PlayerOfficers";
import { AllianceClass } from "../../shared/models/v1/ogame/classes/AllianceClass";
import { BuildingType } from "../../shared/models/v1/ogame/buildings/BuildingType";
import { BasicPlanetData, BasicPlanetDataMoon, BasicPlanetDataPlanet, PlanetDataWrapper, PlanetDefenseCounts } from "../../shared/messages/tracking/empire";
import { ItemHash } from "../../shared/models/v1/ogame/items/ItemHash";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { PlanetData } from "../../shared/models/v1/empire/PlanetData";
import { MoonData } from "../../shared/models/v1/empire/MoonData";
import { DefenseType } from "../../shared/models/v1/ogame/defenses/DefenseType";
import { ShipType } from "../../shared/models/v1/ogame/ships/ShipType";
import { PlayerClass } from "../../shared/models/v1/ogame/classes/PlayerClass";
import { ResearchType } from "../../shared/models/v1/ogame/research/ResearchType";

export class EmpireModule {
    private readonly empireManagers: Record<string, EmpireManager | undefined> = {};

    public async updateOfficers(meta: MessageOgameMeta, data: PlayerOfficers): Promise<void> {
        const manager = this.getManager(meta);
        await manager.update(localPlayerData => {
            localPlayerData.officers = data;
            return localPlayerData;
        });
    }

    public async updateAlliance(meta: MessageOgameMeta, data: AllianceClass) {
        const manager = this.getManager(meta);
        await manager.update(localPlayerData => {
            localPlayerData.allianceClass = data;
            return localPlayerData;
        });
    }

    public async updateActiveItems(meta: MessageOgameMeta, data: PlanetDataWrapper<Partial<Record<ItemHash, number>>>) {
        const manager = this.getManager(meta);
        await manager.update(localPlayerData => {
            localPlayerData.planets[data.planetId].activeItems = data.data;
            return localPlayerData;
        });
    }

    public async updateBuildingLevels(meta: MessageOgameMeta, data: PlanetDataWrapper<Partial<Record<BuildingType, number>>>) {
        const manager = this.getManager(meta);
        await manager.update(localPlayerData => {
            const updateFacilities = Object.keys(localPlayerData.planets[data.planetId].buildings.facilities)
                .map(p => parseIntSafe(p, 10))
                .filter(b => Object.keys(data.data).map(b => parseIntSafe(b, 10) as BuildingType).includes(b)) as BuildingType[];

            const updateSupplies = Object.keys(localPlayerData.planets[data.planetId].buildings.production)
                .map(p => parseIntSafe(p, 10))
                .filter(b => Object.keys(data.data).map(b => parseIntSafe(b, 10) as BuildingType).includes(b)) as BuildingType[];

            const planetFacilities = localPlayerData.planets[data.planetId].buildings.facilities as Record<BuildingType, number>;
            const planetSupplies = localPlayerData.planets[data.planetId].buildings.production as Record<BuildingType, number>;

            updateFacilities.forEach(b => planetFacilities[b] = data.data[b]!);
            updateSupplies.forEach(b => planetSupplies[b] = data.data[b]!);
            return localPlayerData;
        });
    }

    public async updateBasicPlanets(meta: MessageOgameMeta, data: BasicPlanetData[]) {
        const manager = this.getManager(meta);
        await manager.update(localPlayerData => {
            // remove old planets that dont exist anymore
            Object.keys(localPlayerData.planets)
                .map(pid => parseIntSafe(pid, 10))
                .filter(pid => !data.some(planet => planet.id == pid))
                .forEach(planetId => delete localPlayerData.planets[planetId]);

            // add new planets
            data.filter(planet => localPlayerData.planets[planet.id] == null)
                .forEach(p => {
                    if (p.isMoon) {
                        const moon = this.createMoonData(p);
                        localPlayerData.planets[moon.id] = moon;
                    } else {
                        const planet = this.createPlanetData(p);
                        localPlayerData.planets[planet.id] = planet;
                    }
                });


            return localPlayerData;
        });
    }

    public async updatePlanetDefenses(meta: MessageOgameMeta, data: PlanetDataWrapper<PlanetDefenseCounts>) {
        const manager = this.getManager(meta);
        await manager.update(localPlayerData => {
            localPlayerData.planets[data.planetId].defense = data.data;
            return localPlayerData;
        });
    }

    public async updatePlanetShips(meta: MessageOgameMeta, data: PlanetDataWrapper<Partial<Record<ShipType, number>>>) {
        const manager = this.getManager(meta);
        await manager.update(localPlayerData => {
            const ships = localPlayerData.planets[data.planetId].ships as Record<ShipType, number>;

            Object.keys(data.data)
                .map(shipId => parseIntSafe(shipId, 10) as ShipType)
                .filter(ship => ships[ship] != null)
                .forEach(shipId => ships[shipId] = data.data[shipId]!);
            return localPlayerData;
        });
    }

    public async updatePlayerClass(meta: MessageOgameMeta, data: PlayerClass) {
        const manager = this.getManager(meta);
        await manager.update(localPlayerData => {
            localPlayerData.playerClass = data;
            return localPlayerData;
        });
    }

    public async updateResearchLevels(meta: MessageOgameMeta, researchLevels: Record<ResearchType, number>) {
        const manager = this.getManager(meta);
        await manager.update(localPlayerData => {
            localPlayerData.research = researchLevels;
            return localPlayerData;
        });
    }

    private createMoonData(p: BasicPlanetDataMoon): MoonData {
        return {
            isMoon: true,
            id: p.id,
            coordinates: p.coordinates,
            activeItems: {},
            name: p.name,
            buildings: {
                facilities: {
                    [BuildingType.roboticsFactory]: 0,
                    [BuildingType.shipyard]: 0,
                    [BuildingType.lunarBase]: 0,
                    [BuildingType.sensorPhalanx]: 0,
                    [BuildingType.jumpGate]: 0,
                },
                production: {
                    [BuildingType.metalStorage]: 0,
                    [BuildingType.crystalStorage]: 0,
                    [BuildingType.deuteriumTank]: 0,
                },
            },
            defense: {
                [DefenseType.rocketLauncher]: 0,
                [DefenseType.lightLaser]: 0,
                [DefenseType.heavyLaser]: 0,
                [DefenseType.gaussCannon]: 0,
                [DefenseType.ionCannon]: 0,
                [DefenseType.plasmaTurret]: 0,
                [DefenseType.smallShieldDome]: false,
                [DefenseType.largeShieldDome]: false,
                [DefenseType.interplanetaryMissile]: 0,
                [DefenseType.ballisticMissile]: 0,
            },
            ships: {
                [ShipType.lightFighter]: 0,
                [ShipType.heavyFighter]: 0,
                [ShipType.cruiser]: 0,
                [ShipType.battleship]: 0,
                [ShipType.battlecruiser]: 0,
                [ShipType.bomber]: 0,
                [ShipType.destroyer]: 0,
                [ShipType.deathStar]: 0,
                [ShipType.reaper]: 0,
                [ShipType.pathfinder]: 0,

                [ShipType.smallCargo]: 0,
                [ShipType.largeCargo]: 0,
                [ShipType.colonyShip]: 0,
                [ShipType.recycler]: 0,
                [ShipType.espionageProbe]: 0,
                [ShipType.solarSatellite]: 0,
            },
        };
    }
    private createPlanetData(p: BasicPlanetDataPlanet): PlanetData {
        return {
            isMoon: false,
            id: p.id,
            coordinates: p.coordinates,
            maxTemperature: p.maxTemperature,
            productionSettings: {
                [BuildingType.metalMine]: 100,
                [BuildingType.crystalMine]: 100,
                [BuildingType.deuteriumSynthesizer]: 100,
                [BuildingType.solarPlant]: 100,
                [BuildingType.fusionReactor]: 100,
                [ShipType.solarSatellite]: 0,
                [ShipType.crawler]: 0,
            },
            activeItems: {},
            name: p.name,
            buildings: {
                facilities: {
                    [BuildingType.roboticsFactory]: 0,
                    [BuildingType.shipyard]: 0,
                    [BuildingType.researchLab]: 0,
                    [BuildingType.allianceDepot]: 0,
                    [BuildingType.missileSilo]: 0,
                    [BuildingType.naniteFactory]: 0,
                    [BuildingType.terraformer]: 0,
                    [BuildingType.spaceDock]: 0,
                },
                production: {
                    [BuildingType.metalMine]: 0,
                    [BuildingType.crystalMine]: 0,
                    [BuildingType.deuteriumSynthesizer]: 0,
                    [BuildingType.metalStorage]: 0,
                    [BuildingType.crystalStorage]: 0,
                    [BuildingType.deuteriumTank]: 0,
                    [BuildingType.solarPlant]: 0,
                    [BuildingType.fusionReactor]: 0,
                },
            },
            defense: {
                [DefenseType.rocketLauncher]: 0,
                [DefenseType.lightLaser]: 0,
                [DefenseType.heavyLaser]: 0,
                [DefenseType.gaussCannon]: 0,
                [DefenseType.ionCannon]: 0,
                [DefenseType.plasmaTurret]: 0,
                [DefenseType.smallShieldDome]: false,
                [DefenseType.largeShieldDome]: false,
                [DefenseType.interplanetaryMissile]: 0,
                [DefenseType.ballisticMissile]: 0,
            },
            ships: {
                [ShipType.lightFighter]: 0,
                [ShipType.heavyFighter]: 0,
                [ShipType.cruiser]: 0,
                [ShipType.battleship]: 0,
                [ShipType.battlecruiser]: 0,
                [ShipType.bomber]: 0,
                [ShipType.destroyer]: 0,
                [ShipType.deathStar]: 0,
                [ShipType.reaper]: 0,
                [ShipType.pathfinder]: 0,

                [ShipType.smallCargo]: 0,
                [ShipType.largeCargo]: 0,
                [ShipType.colonyShip]: 0,
                [ShipType.recycler]: 0,
                [ShipType.espionageProbe]: 0,
                [ShipType.solarSatellite]: 0,
                [ShipType.crawler]: 0,
            },
        };
    }


    public async getEmpireData(meta: MessageOgameMeta): Promise<LocalPlayerData> {
        const manager = this.getManager(meta);
        const localPlayerData = await manager.getData();
        return localPlayerData;
    }

    private getManager(meta: MessageOgameMeta): EmpireManager {
        const key = getStorageKeyPrefix(meta);
        const manager = (this.empireManagers[key] ??= new EmpireManager(key));

        return manager;
    }
}

