import { BuildingType } from "../../buildings/BuildingType";
import { Cost } from "../../common/Cost";
import { ResourceType } from "../../resources/ResourceType";
import { CostAndTimeReduction } from "../common-interfaces";
import { LifeformBuildingType } from "../LifeformBuildingType";
import { LifeformBuilding } from "./LifeformBuilding";

export interface ResourceProductionBonusLifeformBuilding extends LifeformBuilding {
    appliesTo(resource: ResourceType | 'energy'): boolean;
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

export interface SpaceDockBonusLifeformBuilding extends LifeformBuilding {
    getSpaceDockBonus(level: number): number;
}