import { BuildingType, PlanetBuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { Cost } from "@/shared/models/ogame/common/Cost";
import { LifeformBuildingType } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyType } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";
import { ResourceType } from "@/shared/models/ogame/resources/ResourceType";

export type MineBuildingType = BuildingType.metalMine | BuildingType.crystalMine | BuildingType.deuteriumSynthesizer;

export interface LifeformBuildingLevel {
    planetId: number;
    building: LifeformBuildingType;
    level: number;
}

export interface LifeformTechnologyLevel {
    planetId: number;
    technology: LifeformTechnologyType;
    level: number;
}


export interface BaseAmortizationItem {
    cost: Cost;
    costMsu: number;
    productionDelta: Cost;
    productionDeltaMsu: number;
    timeInHours: number;
}

export interface MineAmortizationItem extends BaseAmortizationItem {
    type: 'mine';
    planetId: number;
    mine: MineBuildingType;
    level: number;
    additionalLifeformBuildings: LifeformBuildingLevel[];

    newMineProduction: number;
    newMineCostReduction: Record<MineBuildingType, number>;
    newLifeformBuildingCostReduction: Record<LifeformBuildingType, number>;
}

export interface PlasmaTechnologyAmortizationItem extends BaseAmortizationItem {
    type: 'plasma-technology';
    level: number;
    additionalLifeformStuff: (LifeformTechnologyLevel | LifeformBuildingLevel)[];

    newPlasmaTechnologyCostReduction: number;
    newLifeformBuildingCostReduction: Record<LifeformBuildingType, number>;
    newLifeformTechnologyCostReduction: Record<LifeformTechnologyType, number>;
}

export interface AstrophysicsAmortizationLevels {
    mines: Record<MineBuildingType, number>;
    lifeformBuildings: Record<LifeformBuildingType, number>;
    lifeformTechnologie: Record<LifeformTechnologyType, number>;
}
export interface AstrophysicsAmortizationItem extends BaseAmortizationItem {
    type: 'astrophysics-and-colony';
    levels: number[];
    newPlanetId: number;

    builtLevels: AstrophysicsAmortizationLevels;
    additionalLifeformTechnologies: LifeformTechnologyLevel[];
}

export interface LifeformBuildingAmortizationItem extends BaseAmortizationItem {
    type: 'lifeform-building';
    planetId: number;
    building: LifeformBuildingType;
    level: number;
    additionalLifeformBuildings: LifeformBuildingLevel[];
}

export interface LifeformTechnologyAmortizationItem extends BaseAmortizationItem {
    type: 'lifeform-technology';
    planetId: number;
    technology: LifeformTechnologyType;
    level: number;
    additionalLifeformBuildings: LifeformBuildingLevel[];
}

export type AmortizationItem =
    | MineAmortizationItem
    | PlasmaTechnologyAmortizationItem
    | AstrophysicsAmortizationItem
    | LifeformBuildingAmortizationItem
    | LifeformTechnologyAmortizationItem;
