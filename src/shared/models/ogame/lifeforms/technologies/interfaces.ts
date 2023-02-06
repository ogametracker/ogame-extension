import { ExpeditionEventType } from "@/shared/models/expeditions/ExpeditionEventType";
import { BuildingType } from "../../buildings/BuildingType";
import { PlayerClass } from "../../classes/PlayerClass";
import { Cost } from "../../common/Cost";
import { DefenseType } from "../../defenses/DefenseType";
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

export interface ClassBonusLifeformTechnology extends LifeformTechnology {
    appliesTo(playerClass: PlayerClass): boolean;
    getClassBonus(playerClass: PlayerClass, level: number): number;
}

export interface StatsBonus {
    armor: number;
    shield: number;
    damage: number;
    cargo: number;
    speed: number;
}
export interface StatsBonusLifeformTechnology extends LifeformTechnology {
    appliesTo(ship: ShipType | DefenseType): boolean;
    getStatsBonus(ship: ShipType | DefenseType, level: number): StatsBonus;
}

export interface DenCapacityBonusLifeformTechnology extends LifeformTechnology {
    getDenCapacityBonus(level: number): number;
}

export interface FuelConsumptionReductionLifeformTechnology extends LifeformTechnology {
    appliesTo(ship: ShipType): boolean;
    getFuelConsumptionReduction(ship: ShipType, level: number): number;
}

export interface FleetFuelReturnLifeformTechnology extends LifeformTechnology {
    getFuelReturn(level: number): number;
}

export interface ExpeditionBonusLifeformTechnology extends LifeformTechnology {
    appliesTo(type: ExpeditionEventType): boolean;
    getExpeditionBonus(type: ExpeditionEventType, level: number): number;
}
export interface ExpeditionEventProbabilityBonusLifeformTechnology extends LifeformTechnology {
    appliesTo(type: ExpeditionEventType): boolean;
    getExpeditionEventProbabilityBonus(type: ExpeditionEventType, level: number): number;
}

//TODO: intergalactic envoys => 11201
//TODO: Expedition speed booster => 14210
//TODO: Phalanx range booster => 14208

//TODO: max bonuses in interface or by interface type? => remove from actual implementations because they should be global