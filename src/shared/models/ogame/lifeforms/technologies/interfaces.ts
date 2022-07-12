import { BuildingType } from "../../buildings/BuildingType";
import { Cost } from "../../common/Cost";
import { ResearchType } from "../../research/ResearchType";
import { CostAndTimeReduction } from "../common-interfaces";

export interface ResourceProductionBonusLifeformTechnology {
    getProductionBonus(level: number): Cost;
}

export interface BuildingCostAndTimeReductionLifeformTechnology {
    getBuildingCostAndTimeReduction(building: BuildingType, level: number): CostAndTimeReduction;
}
export interface ResearchCostAndTimeReductionLifeformTechnology {
    getResearchCostAndTimeReduction(research: ResearchType, level: number): CostAndTimeReduction;
}

export interface CrawlerProductionBonusAndConsumptionReductionLifeformTechnology {
    getCrawlerProductionBonus(level: number): number;
    getCrawlerConsumptionReduction(level: number): Cost;
}

export interface CollectorClassBonusLifeformTechnology {
    getCollectorClassBonus(level: number): number;
}