import { MineBuildingType } from "@/shared/models/empire/amortization/models";
import { LifeformBuildingType } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyType } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";

export type GroupedAmortizationItemGroup = Record<number, GroupedAmortizationPlanetItem> & { plasmaTechnology?: GroupedPlasmaTechnologyItem };

export type GroupedAmortizationItem = GroupedAmortizationPlanetItem | GroupedPlasmaTechnologyItem;

export interface GroupedAmortizationPlanetItem {
    type: 'planet-item';
    planetId: number;

    astrophysicsLevels: number[];
    mines: Record<MineBuildingType, number[]>;
    lifeformBuildings: Record<LifeformBuildingType, number[]>;
    lifeformTechnologies: Record<LifeformTechnologyType, number[]>;
}
export interface GroupedPlasmaTechnologyItem {
    type: 'plasma-technology';
    levels: number[];
}