import { BuildingType } from "../../buildings/BuildingType";
import { Cost } from "../../common/Cost";
import { CostAndTimeReduction } from "../common-interfaces";
import { LifeformBuildingType } from "../LifeformBuildingType";

export interface ResourceProductionBonusLifeformBuilding {
    getProductionBonus(level: number): Cost;
}

export interface LifeformTechnologyBonusLifeformBuilding {
    getLifeformTechnologyBonus(level: number): number;
}

export type AnyBuildingType = BuildingType | LifeformBuildingType;
export interface AnyBuildingCostAndTimeReductionLifeformBuilding {
    getCostAndTimeReduction(building: AnyBuildingType, level: number): CostAndTimeReduction;
}


export interface ResourceConsumptionReductionLifeformBuilding {
    getConsumptionReduction(level: number): Cost;
}

export interface LifeformTechnologyResearchBuilding {
    getLifeformTechnologyResearchCostAndTimeReduction(level: number): CostAndTimeReduction;
}