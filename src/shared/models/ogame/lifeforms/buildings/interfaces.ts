import { BuildingType } from "../../buildings/BuildingType";
import { Cost } from "../../common/Cost";
import { CostAndTimeReduction } from "../common-interfaces";
import { LifeformBuildingType } from "../LifeformBuildingType";
import { LifeformBuilding } from "./LifeformBuilding";

export interface ResourceProductionBonusLifeformBuilding extends LifeformBuilding {
    getProductionBonus(level: number): Cost;
}

export interface LifeformTechnologyBonusLifeformBuilding extends LifeformBuilding {
    getLifeformTechnologyBonus(level: number): number;
}

export type AnyBuildingType = BuildingType | LifeformBuildingType;
export interface AnyBuildingCostAndTimeReductionLifeformBuilding extends LifeformBuilding {
    get affectedBuildings(): AnyBuildingType[];
    appliesTo(building: AnyBuildingType): boolean;
    getCostAndTimeReduction(building: AnyBuildingType, level: number): CostAndTimeReduction;
}


export interface ResourceConsumptionReductionLifeformBuilding extends LifeformBuilding {
    getConsumptionReduction(level: number): Cost;
}

export interface LifeformTechnologyResearchBuilding extends LifeformBuilding {
    getLifeformTechnologyResearchCostAndTimeReduction(level: number): CostAndTimeReduction;
}