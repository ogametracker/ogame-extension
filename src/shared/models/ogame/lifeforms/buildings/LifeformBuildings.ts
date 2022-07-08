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

export const ResourceProductionBonusLifeformBuildings: ResourceProductionBonusLifeformBuilding[] = [
    // humans
    FusionPoweredProduction,
    HighEnergySmelting,

    // rocktal
    CrystalRefinery,
    DeuteriumSynthesiser,
    DisruptionChamber,
    MagmaForge,

    // mechas
    HighPerformanceSynthesiser,
    HighPerformanceTransformer,

    // kaelesh 
    // none
];

export const LifeformTechnologyBonusLifeformBuildings: LifeformTechnologyBonusLifeformBuilding[] = [
    // humans
    Metropolis,

    // rocktal
    // none

    // mechas
    ChipMassProduction,
    HighPerformanceTransformer,

    // kaelesh
    // none
];

export const AnyBuildingCostAndTimeReductionLifeformBuildings: AnyBuildingCostAndTimeReductionLifeformBuilding[] = [
    // humans
    // none

    // rocktal
    MineralResearchCentre,
    Megalith,

    // mechas
    // none

    // kaelesh
    // none
];

export const ResourceConsumptionReductionLifeformBuildings: ResourceConsumptionReductionLifeformBuilding[] = [
    // humans
    // none

    // rocktal
    DisruptionChamber,

    // mechas
    // none

    // kaelesh
    // none
];

export const LifeformTechnologyResearchBuildings: LifeformTechnologyResearchBuilding[] = [
    // humans
    ResearchCentre,

    // rocktal
    RuneTechnologium,

    // mechas
    RoboticsResearchCentre,

    // kaelesh
    VortexChamber,
];