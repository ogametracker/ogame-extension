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
import { LifeformBuildingType } from "../LifeformBuildingType";

export const ResourceProductionBonusLifeformBuildingsByLifeform: Record<LifeformType, ResourceProductionBonusLifeformBuilding[]> = {
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


export const LifeformTechnologyBonusLifeformBuildingsByLifeform: Record<LifeformType, LifeformTechnologyBonusLifeformBuilding[]> = {
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


export const AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform: Record<LifeformType, AnyBuildingCostAndTimeReductionLifeformBuilding[]> = {
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


export const ResourceConsumptionReductionLifeformBuildingsByLifeform: Record<LifeformType, ResourceConsumptionReductionLifeformBuilding[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [],
    [LifeformType.rocktal]: [
        DisruptionChamber,
    ],
    [LifeformType.mechas]: [],
    [LifeformType.kaelesh]: [],
};
export const ResourceConsumptionReductionLifeformBuildings = Object.values(ResourceConsumptionReductionLifeformBuildingsByLifeform).flatMap(r => r);


export const LifeformTechnologyResearchBuildingsByLifeform: Record<LifeformType, LifeformTechnologyResearchBuilding[]> = {
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



export const LifeformBuildingsByType: Record<LifeformBuildingType, LifeformBuilding> = {
    [LifeformBuildingType.residentialSector]: null!, //TODO:
    [LifeformBuildingType.biosphereFarm]: null!, //TODO:
    [LifeformBuildingType.researchCentre]: ResearchCentre,
    [LifeformBuildingType.academyOfSciences]: null!, //TODO:
    [LifeformBuildingType.neuroCalibrationCentre]: null!, //TODO:
    [LifeformBuildingType.highEnergySmelting]: HighEnergySmelting,
    [LifeformBuildingType.foodSilo]: null!, //TODO:
    [LifeformBuildingType.fusionPoweredProduction]: FusionPoweredProduction,
    [LifeformBuildingType.skyscraper]: null!, //TODO:
    [LifeformBuildingType.biotechLab]: null!, //TODO:
    [LifeformBuildingType.metropolis]: Metropolis,
    [LifeformBuildingType.planetaryShield]: null!, //TODO:

    [LifeformBuildingType.meditationEnclave]: null!, //TODO:
    [LifeformBuildingType.crystalFarm]: null!, //TODO:
    [LifeformBuildingType.runeTechnologium]: RuneTechnologium,
    [LifeformBuildingType.runeForge]: null!, //TODO:
    [LifeformBuildingType.oriktorium]: null!, //TODO:
    [LifeformBuildingType.magmaForge]: MagmaForge,
    [LifeformBuildingType.disruptionChamber]: DisruptionChamber,
    [LifeformBuildingType.megalith]: Megalith,
    [LifeformBuildingType.crystalRefinery]: CrystalRefinery,
    [LifeformBuildingType.deuteriumSynthesiser]: DeuteriumSynthesiser,
    [LifeformBuildingType.mineralResearchCentre]: MineralResearchCentre,
    [LifeformBuildingType.advancedRecyclingPlant]: null!, //TODO:

    [LifeformBuildingType.assemblyLine]: null!, //TODO:
    [LifeformBuildingType.fusionCellFactory]: null!, //TODO:
    [LifeformBuildingType.roboticsResearchCentre]: RoboticsResearchCentre,
    [LifeformBuildingType.updateNetwork]: null!, //TODO:
    [LifeformBuildingType.quantumComputerCentre]: null!, //TODO:
    [LifeformBuildingType.automatisedAssemblyCentre]: null!, //TODO:
    [LifeformBuildingType.highPerformanceTransformer]: HighPerformanceTransformer,
    [LifeformBuildingType.microchipAssemblyLine]: null!, //TODO:
    [LifeformBuildingType.productionAssemblyHall]: null!, //TODO:
    [LifeformBuildingType.highPerformanceSynthesiser]: HighPerformanceSynthesiser,
    [LifeformBuildingType.chipMassProduction]: ChipMassProduction,
    [LifeformBuildingType.nanoRepairBots]: null!, //TODO:

    [LifeformBuildingType.sanctuary]: null!, //TODO:
    [LifeformBuildingType.antimatterCondenser]: null!, //TODO:
    [LifeformBuildingType.vortexChamber]: VortexChamber,
    [LifeformBuildingType.hallsOfRealisation]: null!, //TODO:
    [LifeformBuildingType.forumOfTranscendence]: null!, //TODO:
    [LifeformBuildingType.antimatterConvector]: null!, //TODO:
    [LifeformBuildingType.cloningLaboratory]: null!, //TODO:
    [LifeformBuildingType.chrysalisAccelerator]: null!, //TODO:
    [LifeformBuildingType.bioModifier]: null!, //TODO:
    [LifeformBuildingType.psionicModulator]: null!, //TODO:
    [LifeformBuildingType.shipManufacturingHall]: null!, //TODO:
    [LifeformBuildingType.supraRefractor]: null!, //TODO:
};