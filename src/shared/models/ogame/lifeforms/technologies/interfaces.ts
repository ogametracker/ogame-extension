import { BuildingType } from "../../buildings/BuildingType";
import { Cost } from "../../common/Cost";
import { ResearchType } from "../../research/ResearchType";
import { CostAndTimeReduction } from "../common-interfaces";
import { LifeformTechnology } from "./LifeformTechnology";

export interface ResourceProductionBonusLifeformTechnology extends LifeformTechnology {
    getProductionBonus(level: number): Cost;
}

export interface BuildingCostAndTimeReductionLifeformTechnology extends LifeformTechnology {
    getBuildingCostAndTimeReduction(building: BuildingType, level: number): CostAndTimeReduction;
}
export interface ResearchCostAndTimeReductionLifeformTechnology extends LifeformTechnology {
    appliesTo(research: ResearchType): boolean;
    getResearchCostAndTimeReduction(research: ResearchType, level: number): CostAndTimeReduction;
}

export interface CrawlerProductionBonusAndConsumptionReductionLifeformTechnology extends LifeformTechnology {
    getCrawlerProductionBonus(level: number): number;
    getCrawlerConsumptionReduction(level: number): Cost;
}

export interface CollectorClassBonusLifeformTechnology extends LifeformTechnology {
    getCollectorClassBonus(level: number): number;
}