export enum BuildingType {
    metalMine = 1,
    crystalMine = 2,
    deuteriumSynthesizer = 3,

    metalStorage = 22,
    crystalStorage = 23,
    deuteriumTank = 24,

    solarPlant = 4,
    fusionReactor = 12,

    roboticsFactory = 14,
    shipyard = 21,
    researchLab = 31,
    allianceDepot = 34,
    missileSilo = 44,
    naniteFactory = 15,
    terraformer = 33,
    spaceDock = 36,

    lunarBase = 41,
    sensorPhalanx = 42,
    jumpGate = 43,
}

export type MoonBuildingType = (
    | BuildingType.metalStorage
    | BuildingType.crystalStorage
    | BuildingType.deuteriumTank

    | BuildingType.roboticsFactory
    | BuildingType.shipyard
    | BuildingType.lunarBase
    | BuildingType.sensorPhalanx
    | BuildingType.jumpGate
);
export type PlanetBuildingType = (
    | BuildingType.metalMine
    | BuildingType.crystalMine
    | BuildingType.deuteriumSynthesizer
    | BuildingType.metalStorage
    | BuildingType.crystalStorage
    | BuildingType.deuteriumTank
    | BuildingType.solarPlant
    | BuildingType.fusionReactor

    | BuildingType.roboticsFactory
    | BuildingType.shipyard
    | BuildingType.researchLab
    | BuildingType.allianceDepot
    | BuildingType.missileSilo
    | BuildingType.naniteFactory
    | BuildingType.terraformer
    | BuildingType.spaceDock
);