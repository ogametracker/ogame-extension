import { BuildingType } from '../ogame/buildings/BuildingType';

export interface MoonBuildingLevels {
    [BuildingType.metalStorage]: number;
    [BuildingType.crystalStorage]: number;
    [BuildingType.deuteriumTank]: number;

    [BuildingType.roboticsFactory]: number;
    [BuildingType.shipyard]: number;

    [BuildingType.lunarBase]: number;
    [BuildingType.sensorPhalanx]: number;
    [BuildingType.jumpGate]: number;
}