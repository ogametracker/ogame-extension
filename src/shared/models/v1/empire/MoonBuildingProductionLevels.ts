import { BuildingType } from "../ogame/buildings/BuildingType";

export interface MoonBuildingProductionLevels {
    [BuildingType.metalStorage]: number;
    [BuildingType.crystalStorage]: number;
    [BuildingType.deuteriumTank]: number;
}