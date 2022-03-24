import { BuildingType } from '../ogame/buildings/BuildingType';

export interface PlanetBuildingProductionLevels {
    [BuildingType.metalMine]: number;
    [BuildingType.crystalMine]: number;
    [BuildingType.deuteriumSynthesizer]: number;

    [BuildingType.metalStorage]: number;
    [BuildingType.crystalStorage]: number;
    [BuildingType.deuteriumTank]: number;

    [BuildingType.solarPlant]: number;
    [BuildingType.fusionReactor]: number;
}