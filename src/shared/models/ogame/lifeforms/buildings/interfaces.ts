import { BuildingType } from "../../buildings/BuildingType";
import { Cost } from "../../common/Cost";
import { ResearchType } from "../../research/ResearchType";
import { LifeformBuildingType } from "../LifeformBuildingType";
import { LifeformTechnologyType } from "../LifeformTechnologyType";

export interface ResourceProductionBonusLifeformBuilding {
    getProductionBonus(level: number): Cost;
}

export interface LifeformTechnologyBonusLifeformBuilding {
    getLifeformTechnologyBonus(level: number): number;
}


export interface CostAndTimeReduction {
    cost: number;
    time: number;
}
export type TechnologyType = BuildingType | LifeformBuildingType | LifeformTechnologyType | ResearchType;

export interface TechnologyCostAndTimeReductionLifeformBuilding {
    getCostAndTimeReduction(technology: TechnologyType, level: number): number;
}


export interface ResourceConsumptionReductionLifeformBuilding {
    getConsumptionReduction(level: number): Cost;
}