import { AnyBuildingCostAndTimeReductionLifeformBuilding, LifeformTechnologyBonusLifeformBuilding, LifeformTechnologyResearchBuilding, ResourceConsumptionReductionLifeformBuilding, ResourceProductionBonusLifeformBuilding, SpaceDockBonusLifeformBuilding } from "./interfaces";
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
import { ResidentialSector } from "./humans/ResidentialSector";
import { BiosphereFarm } from "./humans/BiosphereFarm";
import { AcademyOfSciences } from "./humans/AcademyOfSciences";
import { NeuroCalibrationCentre } from "./humans/NeuroCalibrationCentre";
import { FoodSilo } from "./humans/FoodSilo";
import { Skyscraper } from "./humans/Skyscraper";
import { BiotechLab } from "./humans/BiotechLab";
import { PlanetaryShield } from "./humans/PlanetaryShield";
import { MeditationEnclave } from "./rocktal/MeditationEnclave";
import { CrystalFarm } from "./rocktal/CrystalFarm";
import { RuneForge } from "./rocktal/RuneForge";
import { Oriktorium } from "./rocktal/Oriktorium";
import { AdvancedRecyclingPlant } from "./rocktal/AdvancedRecyclingPlant";
import { AssemblyLine } from "./mechas/AssemblyLine";
import { FusionCellFactory } from "./mechas/FusionCellFactory";
import { UpdateNetwork } from "./mechas/UpdateNetwork";
import { QuantumComputerCentre } from "./mechas/QuantumComputerCentre";
import { AutomatisedAssemblyCentre } from "./mechas/AutomatisedAssemblyCentre";
import { MicrochipAssemblyLine } from "./mechas/MicrochipAssemblyLine";
import { ProductionAssemblyHall } from "./mechas/ProductionAssemblyHall";
import { NanoRepairBots } from "./mechas/NanoRepairBots";
import { Sanctuary } from "./kaelesh/Sanctuary";
import { AntimatterCondenser } from "./kaelesh/AntimatterCondenser";
import { HallsOfRealisation } from "./kaelesh/HallsOfRealisation";
import { ForumOfTranscendence } from "./kaelesh/ForumOfTranscendence";
import { AntimatterConvector } from "./kaelesh/AntimatterConvector";
import { CloningLaboratory } from "./kaelesh/CloningLaboratory";
import { ChrysalisAccelerator } from "./kaelesh/ChrysalisAccelerator";
import { BioModifier } from "./kaelesh/BioModifier";
import { PsionicModulator } from "./kaelesh/PsionicModulator";
import { ShipManufacturingHall } from "./kaelesh/ShipManufacturingHall";
import { SupraRefractor } from "./kaelesh/SupraRefractor";

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
    [LifeformType.kaelesh]: [
        CloningLaboratory,
    ],
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



export const SpaceDockBonusLifeformBuildingsByLifeform: Record<LifeformType, SpaceDockBonusLifeformBuilding[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [],
    [LifeformType.rocktal]: [],
    [LifeformType.mechas]: [
        NanoRepairBots,
    ],
    [LifeformType.kaelesh]: [],
};
export const SpaceDockBonusLifeformBuildings = Object.values(SpaceDockBonusLifeformBuildingsByLifeform).flatMap(r => r);



export const LifeformBuildingsByType: Record<LifeformBuildingType, LifeformBuilding> = {
    [LifeformBuildingType.residentialSector]: ResidentialSector,
    [LifeformBuildingType.biosphereFarm]: BiosphereFarm,
    [LifeformBuildingType.researchCentre]: ResearchCentre,
    [LifeformBuildingType.academyOfSciences]: AcademyOfSciences,
    [LifeformBuildingType.neuroCalibrationCentre]: NeuroCalibrationCentre,
    [LifeformBuildingType.highEnergySmelting]: HighEnergySmelting,
    [LifeformBuildingType.foodSilo]: FoodSilo,
    [LifeformBuildingType.fusionPoweredProduction]: FusionPoweredProduction,
    [LifeformBuildingType.skyscraper]: Skyscraper,
    [LifeformBuildingType.biotechLab]: BiotechLab,
    [LifeformBuildingType.metropolis]: Metropolis,
    [LifeformBuildingType.planetaryShield]: PlanetaryShield,

    [LifeformBuildingType.meditationEnclave]: MeditationEnclave,
    [LifeformBuildingType.crystalFarm]: CrystalFarm,
    [LifeformBuildingType.runeTechnologium]: RuneTechnologium,
    [LifeformBuildingType.runeForge]: RuneForge,
    [LifeformBuildingType.oriktorium]: Oriktorium,
    [LifeformBuildingType.magmaForge]: MagmaForge,
    [LifeformBuildingType.disruptionChamber]: DisruptionChamber,
    [LifeformBuildingType.megalith]: Megalith,
    [LifeformBuildingType.crystalRefinery]: CrystalRefinery,
    [LifeformBuildingType.deuteriumSynthesiser]: DeuteriumSynthesiser,
    [LifeformBuildingType.mineralResearchCentre]: MineralResearchCentre,
    [LifeformBuildingType.advancedRecyclingPlant]: AdvancedRecyclingPlant,

    [LifeformBuildingType.assemblyLine]: AssemblyLine,
    [LifeformBuildingType.fusionCellFactory]: FusionCellFactory,
    [LifeformBuildingType.roboticsResearchCentre]: RoboticsResearchCentre,
    [LifeformBuildingType.updateNetwork]: UpdateNetwork,
    [LifeformBuildingType.quantumComputerCentre]: QuantumComputerCentre,
    [LifeformBuildingType.automatisedAssemblyCentre]: AutomatisedAssemblyCentre,
    [LifeformBuildingType.highPerformanceTransformer]: HighPerformanceTransformer,
    [LifeformBuildingType.microchipAssemblyLine]: MicrochipAssemblyLine,
    [LifeformBuildingType.productionAssemblyHall]: ProductionAssemblyHall,
    [LifeformBuildingType.highPerformanceSynthesiser]: HighPerformanceSynthesiser,
    [LifeformBuildingType.chipMassProduction]: ChipMassProduction,
    [LifeformBuildingType.nanoRepairBots]: NanoRepairBots,

    [LifeformBuildingType.sanctuary]: Sanctuary,
    [LifeformBuildingType.antimatterCondenser]: AntimatterCondenser,
    [LifeformBuildingType.vortexChamber]: VortexChamber,
    [LifeformBuildingType.hallsOfRealisation]: HallsOfRealisation,
    [LifeformBuildingType.forumOfTranscendence]: ForumOfTranscendence,
    [LifeformBuildingType.antimatterConvector]: AntimatterConvector,
    [LifeformBuildingType.cloningLaboratory]: CloningLaboratory,
    [LifeformBuildingType.chrysalisAccelerator]: ChrysalisAccelerator,
    [LifeformBuildingType.bioModifier]: BioModifier,
    [LifeformBuildingType.psionicModulator]: PsionicModulator,
    [LifeformBuildingType.shipManufacturingHall]: ShipManufacturingHall,
    [LifeformBuildingType.supraRefractor]: SupraRefractor,
};