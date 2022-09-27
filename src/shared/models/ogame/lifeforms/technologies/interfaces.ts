import { BuildingType } from "../../buildings/BuildingType";
import { Cost } from "../../common/Cost";
import { ResearchType } from "../../research/ResearchType";
import { ShipType } from "../../ships/ShipType";
import { CostAndTimeReduction } from "../common-interfaces";
import { LifeformTechnologyType } from "../LifeformTechnologyType";
import { LifeformTechnology } from "./LifeformTechnology";

export interface ResourceProductionBonusLifeformTechnology extends LifeformTechnology {
    getProductionBonus(level: number): Cost;
}

export interface BuildingCostAndTimeReductionLifeformTechnology extends LifeformTechnology {
    appliesTo(building: BuildingType): boolean;
    getBuildingCostAndTimeReduction(building: BuildingType, level: number): CostAndTimeReduction;
}

export interface ResearchCostAndTimeReductionLifeformTechnology extends LifeformTechnology {
    appliesTo(research: ResearchType | LifeformTechnologyType): boolean;
    getResearchCostAndTimeReduction(research: ResearchType | LifeformTechnologyType, level: number): CostAndTimeReduction;
}

export interface CrawlerProductionBonusAndConsumptionReductionLifeformTechnology extends LifeformTechnology {
    getCrawlerProductionBonus(level: number): number;
    getCrawlerConsumptionReduction(level: number): Cost;
}

export interface CollectorClassBonusLifeformTechnology extends LifeformTechnology {
    getCollectorClassBonus(level: number): number;
}

export interface ShipStatsBonus {
    armor: number;
    shield: number;
    damage: number;
    cargo: number;
    speed: number;
}
export interface ShipStatsBonusLifeformTechnology extends LifeformTechnology {
    appliesTo(ship: ShipType): boolean;
    getShipStatsBonus(ship: ShipType, level: number): ShipStatsBonus;
}

export interface DenCapacityBonusLifeformTechnology extends LifeformTechnology {
    getDenCapacityBonus(level: number): number;
}