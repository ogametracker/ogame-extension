import { BuildingType } from "../ogame/buildings/BuildingType";

export interface MoonBuildingFacilitiesLevels {
    [BuildingType.roboticsFactory]: number;
    [BuildingType.shipyard]: number;

    [BuildingType.lunarBase]: number;
    [BuildingType.sensorPhalanx]: number;
    [BuildingType.jumpGate]: number;
}