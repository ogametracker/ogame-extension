import { AnyBuildingCostAndTimeReductionLifeformBuilding, LifeformTechnologyBonusLifeformBuilding, LifeformTechnologyResearchBuilding, ResourceConsumptionReductionLifeformBuilding, ResourceProductionBonusLifeformBuilding } from "./interfaces";
import { FusionPoweredProduction } from './humans/FusionPoweredProduction';
import { HighEnergySmelting } from "./humans/HighEnergySmelting";
import { HighPerformanceSynthesiser } from "./mechas/HighPerformanceSynthesiser";
import { HighPerformanceTransformer } from "./mechas/HighPerformanceTransformer";
import { CrystalRefinery } from "./rocktal/CrystalRefinery";
import { DeuteriumSynthesiser } from "./rocktal/DeuteriumSynthesiser";
import { DisruptionChamber } from "./rocktal/DisruptionChamber";
import { MagmaForge } from "./rocktal/MagmaForge";
import { Metropolis } from './humans/Metropolis';
import { ChipMassProduction } from "./mechas/ChipMassProduction";
import { MineralResearchCentre } from "./rocktal/MineralResearchCentre";
import { Megalith } from "./rocktal/Megalith";
import { ResearchCentre } from "./humans/ResearchCentre";
import { RuneTechnologium } from "./rocktal/RuneTechnologium";
import { RoboticsResearchCentre } from "./mechas/RoboticsResearchCentre";
import { VortexChamber } from "./kaelesh/VortexChamber";
import { LifeformType } from "../LifeformType";
import { LifeformBuilding } from "./LifeformBuilding";

export const ResourceProductionBonusLifeformBuildingsByLifeform: Record<LifeformType, (LifeformBuilding & ResourceProductionBonusLifeformBuilding)[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [
        FusionPoweredProduction,
        HighEnergySmelting,
    ],
    [LifeformType.rocktal]: [
        CrystalRefinery,
        DeuteriumSynthesiser,
        DisruptionChamber,
        MagmaForge,
    ],
    [LifeformType.mechas]: [
        HighPerformanceSynthesiser,
        HighPerformanceTransformer,
    ],
    [LifeformType.kaelesh]: [],
};
export const ResourceProductionBonusLifeformBuildings = Object.values(ResourceProductionBonusLifeformBuildingsByLifeform).flatMap(r => r);


export const LifeformTechnologyBonusLifeformBuildingsByLifeform: Record<LifeformType, (LifeformBuilding & LifeformTechnologyBonusLifeformBuilding)[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [
        Metropolis,
    ],
    [LifeformType.rocktal]: [],
    [LifeformType.mechas]: [
        ChipMassProduction,
        HighPerformanceTransformer,
    ],
    [LifeformType.kaelesh]: [],
};
export const LifeformTechnologyBonusLifeformBuildings = Object.values(LifeformTechnologyBonusLifeformBuildingsByLifeform).flatMap(r => r);


export const AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform: Record<LifeformType, (LifeformBuilding & AnyBuildingCostAndTimeReductionLifeformBuilding)[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [],
    [LifeformType.rocktal]: [
        MineralResearchCentre,
        Megalith,
    ],
    [LifeformType.mechas]: [],
    [LifeformType.kaelesh]: [],
};
export const AnyBuildingCostAndTimeReductionLifeformBuildings = Object.values(AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform).flatMap(r => r);


export const ResourceConsumptionReductionLifeformBuildingsByLifeform: Record<LifeformType, (LifeformBuilding & ResourceConsumptionReductionLifeformBuilding)[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [],
    [LifeformType.rocktal]: [
        DisruptionChamber,
    ],
    [LifeformType.mechas]: [],
    [LifeformType.kaelesh]: [],
};
export const ResourceConsumptionReductionLifeformBuildings = Object.values(ResourceConsumptionReductionLifeformBuildingsByLifeform).flatMap(r => r);


export const LifeformTechnologyResearchBuildingsByLifeform: Record<LifeformType, (LifeformBuilding & LifeformTechnologyResearchBuilding)[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [
        ResearchCentre,
    ],
    [LifeformType.rocktal]: [
        RuneTechnologium,
    ],
    [LifeformType.mechas]: [
        RoboticsResearchCentre,
    ],
    [LifeformType.kaelesh]: [
        VortexChamber,
    ],
};
export const LifeformTechnologyResearchBuildings = Object.values(LifeformTechnologyResearchBuildingsByLifeform).flatMap(r => r);