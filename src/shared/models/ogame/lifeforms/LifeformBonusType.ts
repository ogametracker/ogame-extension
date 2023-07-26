import { ExpeditionEventType } from "@/shared/models/expeditions/ExpeditionEventType";
import { BuildingType } from "../buildings/BuildingType";
import { PlayerClass } from "../classes/PlayerClass";
import { DefenseType } from "../defenses/DefenseType";
import { FleetMissionType } from "../fleets/FleetMissionType";
import { ResearchType } from "../research/ResearchType";
import { ShipType } from "../ships/ShipType";
import { LifeformBuildingType } from "./LifeformBuildingType";
import { LifeformTechnologyType } from "./LifeformTechnologyType";


export type LifeformBonusType =
    | { type: LifeformBonusTypeId.FleetSpeedBonus; missionType: FleetMissionType }
    | { type: LifeformBonusTypeId.ResourceProductionBonus }
    | { type: LifeformBonusTypeId.StatsBonus; tech: ShipType | DefenseType }
    | {
        type: LifeformBonusTypeId.TechTimeReduction;
        tech:
        | BuildingType
        | ResearchType
        | LifeformTechnologyType
        | LifeformBuildingType;
    }
    | {
        type: LifeformBonusTypeId.TechCostReduction;
        tech:
        | BuildingType
        | ResearchType
        | LifeformTechnologyType
        | LifeformBuildingType;
    }
    | { type: LifeformBonusTypeId.DenCapacityBonus }
    | { type: LifeformBonusTypeId.CrawlerBonus }
    | { type: LifeformBonusTypeId.CrawlerEnergyConsumptionReduction }
    | { type: LifeformBonusTypeId.PlayerClassBonus; playerClass: PlayerClass }
    | { type: LifeformBonusTypeId.FuelConsumptionReduction }
    | { type: LifeformBonusTypeId.FuelReturn }
    | { type: LifeformBonusTypeId.PhalanxRangeBonus }
    | {
        type: LifeformBonusTypeId.ExpeditionEventProbabilityBonus;
        event: ExpeditionEventType;
    }
    | { type: LifeformBonusTypeId.ExpeditionBonus; event: ExpeditionEventType }
    | { type: LifeformBonusTypeId.EnergyProductionBonus }
    | { type: LifeformBonusTypeId.EnergyConsumptionReduction }
    | { type: LifeformBonusTypeId.AutoRecycleDebrisField }
    | { type: LifeformBonusTypeId.ShipProductionSpeedBonus }
    | { type: LifeformBonusTypeId.FoodConsumptionReduction }
    | { type: LifeformBonusTypeId.MaxPopulationBonus }
    | { type: LifeformBonusTypeId.PopulationGrowthBonus }
    | { type: LifeformBonusTypeId.LifeformResearchBonusBoost }
    | { type: LifeformBonusTypeId.PopulationProtection }
    | { type: LifeformBonusTypeId.SpaceDockBonus }
    | { type: LifeformBonusTypeId.PlanetFieldsBonus }
    | { type: LifeformBonusTypeId.LifeformResearchPopulationConditionReduction }
    | { type: LifeformBonusTypeId.MoonChanceBonus }
    ;

export enum LifeformBonusTypeId {
    FleetSpeedBonus,
    ResourceProductionBonus,
    StatsBonus,
    TechTimeReduction,
    TechCostReduction,
    DenCapacityBonus,
    CrawlerBonus,
    CrawlerEnergyConsumptionReduction,
    PlayerClassBonus,
    FuelConsumptionReduction,
    FuelReturn,
    PhalanxRangeBonus,
    ExpeditionEventProbabilityBonus,
    ExpeditionBonus,
    EnergyProductionBonus,
    EnergyConsumptionReduction,
    AutoRecycleDebrisField,
    ShipProductionSpeedBonus,
    FoodConsumptionReduction,
    MaxPopulationBonus,
    PopulationGrowthBonus,
    LifeformResearchBonusBoost,
    PopulationProtection,
    SpaceDockBonus,
    PlanetFieldsBonus,
    LifeformResearchPopulationConditionReduction,
    MoonChanceBonus,
}
