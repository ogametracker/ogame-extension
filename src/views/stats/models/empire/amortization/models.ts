import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { Cost } from "@/shared/models/ogame/common/Cost";
import { LifeformBuildingType } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyType } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";

export type MineBuildingType = BuildingType.metalMine | BuildingType.crystalMine | BuildingType.deuteriumSynthesizer;

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
}

export interface PlasmaTechnologyAmortizationItem extends BaseAmortizationItem {
    type: 'plasma-technology';
    level: number;
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
}

export interface LifeformBuildingAmortizationItem extends BaseAmortizationItem {
    type: 'lifeform-building';
    planetId: number;
    building: LifeformBuildingType;
    level: number;
}

export interface LifeformTechnologyAmortizationItem extends BaseAmortizationItem {
    type: 'lifeform-technology';
    planetId: number;
    technology: LifeformTechnologyType;
    level: number;
}

export type AmortizationItem =
    | MineAmortizationItem
    | PlasmaTechnologyAmortizationItem
    | AstrophysicsAmortizationItem
    | LifeformBuildingAmortizationItem
    | LifeformTechnologyAmortizationItem;
