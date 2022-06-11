import { BuildingType } from '../ogame/buildings/BuildingType';

export interface PlanetBuildingLevels {
    [BuildingType.metalMine]: number;
    [BuildingType.crystalMine]: number;
    [BuildingType.deuteriumSynthesizer]: number;

    [BuildingType.metalStorage]: number;
    [BuildingType.crystalStorage]: number;
    [BuildingType.deuteriumTank]: number;

    [BuildingType.solarPlant]: number;
    [BuildingType.fusionReactor]: number;
    
    [BuildingType.roboticsFactory]: number;
    [BuildingType.shipyard]: number;
    [BuildingType.researchLab]: number;
    [BuildingType.allianceDepot]: number;
    [BuildingType.missileSilo]: number;
    [BuildingType.naniteFactory]: number;
    [BuildingType.terraformer]: number;
    [BuildingType.spaceDock]: number;
}