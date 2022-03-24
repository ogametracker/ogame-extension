import { BuildingType } from '../ogame/buildings/BuildingType';

export interface PlanetBuildingFacilitiesLevels {
    [BuildingType.roboticsFactory]: number;
    [BuildingType.shipyard]: number;
    [BuildingType.researchLab]: number;
    [BuildingType.allianceDepot]: number;
    [BuildingType.missileSilo]: number;
    [BuildingType.naniteFactory]: number;
    [BuildingType.terraformer]: number;
    [BuildingType.spaceDock]: number;
}