import { LifeformTechnologyType } from "../LifeformTechnologyType";
import { LifeformType } from "../LifeformType";
import { BattlecruiserMkII } from "./humans/BattlecruiserMkII";
import { BomberMkII } from "./humans/BomberMkII";
import { CruiserMkII } from "./humans/CruiserMkII";
import { DestroyerMkII } from "./humans/DestroyerMkII";
import { EnhancedProductionTechnologies } from "./humans/EnhancedProductionTechnologies";
import { FusionDrives } from "./humans/FusionDrives";
import { HighPerformanceExtractors } from "./humans/HighPerformanceExtractors";
import { HighPerformanceTerraformer } from "./humans/HighPerformanceTerraformer";
import { ImprovedLabTechnology } from "./humans/ImprovedLabTechnology";
import { IntergalacticEnvoys } from "./humans/IntergalacticEnvoys";
import { LightFighterMkII } from "./humans/LightFighterMkII";
import { LowTemperatureDrives } from "./humans/LowTemperatureDrives";
import { OrbitalDen } from "./humans/OrbitalDen";
import { PlasmaTerraformer } from "./humans/PlasmaTerraformer";
import { ResearchAI } from "./humans/ResearchAI";
import { RobotAssistants } from "./humans/RobotAssistants";
import { StealthFieldGenerator } from "./humans/StealthFieldGenerator";
import { Supercomputer } from "./humans/Supercomputer";
import { BuildingCostAndTimeReductionLifeformTechnology, CollectorClassBonusLifeformTechnology, CrawlerProductionBonusAndConsumptionReductionLifeformTechnology, ResearchCostAndTimeReductionLifeformTechnology, ResourceProductionBonusLifeformTechnology, StatsBonusLifeformTechnology } from "./interfaces";
import { EfficientSwarmIntelligence } from "./kaelesh/EfficientSwarmIntelligence";
import { EnhancedSensorTechnology } from "./kaelesh/EnhancedSensorTechnology";
import { GravitationSensors } from "./kaelesh/GravitationSensors";
import { HeatRecovery } from "./kaelesh/HeatRecovery";
import { InterplanetaryAnalysisNetwork } from "./kaelesh/InterplanetaryAnalysisNetwork";
import { KaeleshDiscovererEnhancement } from "./kaelesh/KaeleshDiscovererEnhancement";
import { NeuroInterface } from "./kaelesh/NeuroInterface";
import { NeuromodalCompressor } from "./kaelesh/NeuromodalCompressor";
import { Overclocking_Battleship } from "./kaelesh/Overclocking_Battleship";
import { Overclocking_HeavyFighter } from "./kaelesh/Overclocking_HeavyFighter";
import { Overclocking_LargeCargo } from "./kaelesh/Overclocking_LargeCargo";
import { PsionicNetwork } from "./kaelesh/PsionicNetwork";
import { PsionicShieldMatrix } from "./kaelesh/PsionicShieldMatrix";
import { Psychoharmoniser } from "./kaelesh/Psychoharmoniser";
import { SixthSense } from "./kaelesh/SixthSense";
import { SulphideProcess } from "./kaelesh/SulphideProcess";
import { TelekineticDrive } from "./kaelesh/TelekineticDrive";
import { TelekineticTractorBeam } from "./kaelesh/TelekineticTractorBeam";
import { LifeformTechnology } from "./LifeformTechnology";
import { ArtificialSwarmIntelligence } from "./mechas/ArtificialSwarmIntelligence";
import { AutomatedTransportLines } from "./mechas/AutomatedTransportLines";
import { CatalyserTechnology } from "./mechas/CatalyserTechnology";
import { DepotAI } from "./mechas/DepotAI";
import { EfficiencyModule } from "./mechas/EfficiencyModule";
import { ExperimentalRecyclingTechnology } from "./mechas/ExperimentalRecyclingTechnology";
import { ExperimentalWeaponsTechnology } from "./mechas/ExperimentalWeaponsTechnology";
import { GeneralOverhaul_Battlecruiser } from "./mechas/GeneralOverhaul_Battlecruiser";
import { GeneralOverhaul_Battleship } from "./mechas/GeneralOverhaul_Battleship";
import { GeneralOverhaul_Bomber } from "./mechas/GeneralOverhaul_Bomber";
import { GeneralOverhaul_Cruiser } from "./mechas/GeneralOverhaul_Cruiser";
import { GeneralOverhaul_Destroyer } from "./mechas/GeneralOverhaul_Destroyer";
import { GeneralOverhaul_LightFighter } from "./mechas/GeneralOverhaul_LightFighter";
import { HighTemperatureSuperconductors } from "./mechas/HighTemperatureSuperconductors";
import { ImprovedDroneAI } from "./mechas/ImprovedDroneAI";
import { MechanGeneralEnhancement } from "./mechas/MechanGeneralEnhancement";
import { PlasmaDrive } from "./mechas/PlasmaDrive";
import { SlingshotAutopilot } from "./mechas/SlingshotAutopilot";
import { AcousticScanning } from "./rocktal/AcousticScanning";
import { CargoHoldExpansion_CivilianShips } from "./rocktal/CargoHoldExpansion_CivilianShips";
import { DepthSounding } from "./rocktal/DepthSounding";
import { DiamondEnergyTransmitter } from "./rocktal/DiamondEnergyTransmitter";
import { GeothermalPowerPlants } from "./rocktal/GeothermalPowerPlants";
import { HardenedDiamondDrillHeads } from "./rocktal/HardenedDiamondDrillHeads";
import { HighEnergyPumpSystems } from "./rocktal/HighEnergyPumpSystems";
import { ImprovedStellarator } from "./rocktal/ImprovedStellarator";
import { IonCrystalEnhancement_HeavyFighter } from "./rocktal/IonCrystalEnhancement_HeavyFighter";
import { IonCrystalModules } from "./rocktal/IonCrystalModules";
import { MagmaPoweredProduction } from "./rocktal/MagmaPoweredProduction";
import { MagmaPoweredPumpSystems } from "./rocktal/MagmaPoweredPumpSystems";
import { ObsidianShieldReinforcement } from "./rocktal/ObsidianShieldReinforcement";
import { OptimisedSiloConstructionMethod } from "./rocktal/OptimisedSiloConstructionMethod";
import { RocktalCollectorEnhancement } from "./rocktal/RocktalCollectorEnhancement";
import { RuneShields } from "./rocktal/RuneShields";
import { SeismicMiningTechnology } from "./rocktal/SeismicMiningTechnology";
import { VolcanicBatteries } from "./rocktal/VolcanicBatteries";

export const ResourceProductionBonusLifeformTechnologiesByLifeform: Record<LifeformType, ResourceProductionBonusLifeformTechnology[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [
        EnhancedProductionTechnologies,
        HighPerformanceExtractors,
    ],
    [LifeformType.rocktal]: [
        AcousticScanning,
        DepthSounding,
        GeothermalPowerPlants,
        HardenedDiamondDrillHeads,
        HighEnergyPumpSystems,
        MagmaPoweredProduction,
        MagmaPoweredPumpSystems,
        SeismicMiningTechnology,
        VolcanicBatteries,
    ],
    [LifeformType.mechas]: [
        ArtificialSwarmIntelligence,
        AutomatedTransportLines,
        CatalyserTechnology,
    ],
    [LifeformType.kaelesh]: [
        Psychoharmoniser,
        SulphideProcess,
    ],
};
export const ResourceProductionBonusLifeformTechnologies = Object.values(ResourceProductionBonusLifeformTechnologiesByLifeform).flatMap(r => r);


export const CollectorClassBonusLifeformTechnologiesByLifeform: Record<LifeformType, CollectorClassBonusLifeformTechnology[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [],
    [LifeformType.rocktal]: [
        RocktalCollectorEnhancement,
    ],
    [LifeformType.mechas]: [],
    [LifeformType.kaelesh]: [],
};
export const CollectorClassBonusLifeformTechnologies = Object.values(CollectorClassBonusLifeformTechnologiesByLifeform).flatMap(r => r);


export const CrawlerProductionBonusAndConsumptionReductionLifeformTechnologiesByLifeform: Record<LifeformType, CrawlerProductionBonusAndConsumptionReductionLifeformTechnology[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [],
    [LifeformType.rocktal]: [
        IonCrystalModules,
    ],
    [LifeformType.mechas]: [],
    [LifeformType.kaelesh]: [],
};
export const CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies = Object.values(CrawlerProductionBonusAndConsumptionReductionLifeformTechnologiesByLifeform).flatMap(r => r);


export const BuildingCostAndTimeReductionLifeformTechnologiesByLifeform: Record<LifeformType, BuildingCostAndTimeReductionLifeformTechnology[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [],
    [LifeformType.rocktal]: [
        HighPerformanceTerraformer,
        PlasmaTerraformer,
    ],
    [LifeformType.mechas]: [],
    [LifeformType.kaelesh]: [],
};
export const BuildingCostAndTimeReductionLifeformTechnologies = Object.values(BuildingCostAndTimeReductionLifeformTechnologiesByLifeform).flatMap(r => r);


export const ResearchCostAndTimeReductionLifeformTechnologiesByLifeform: Record<LifeformType, ResearchCostAndTimeReductionLifeformTechnology[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [],
    [LifeformType.rocktal]: [
        ImprovedStellarator,
        StealthFieldGenerator,
        ResearchAI,
        ImprovedLabTechnology,
        LowTemperatureDrives,
        RobotAssistants,
    ],
    [LifeformType.mechas]: [],
    [LifeformType.kaelesh]: [],
};
export const ResearchCostAndTimeReductionLifeformTechnologies = Object.values(ResearchCostAndTimeReductionLifeformTechnologiesByLifeform).flatMap(r => r);


export const StatsBonusLifeformTechnologiesByLifeform: Record<LifeformType, StatsBonusLifeformTechnology[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [
        FusionDrives,
        LightFighterMkII,
        CruiserMkII,
        BomberMkII,
        DestroyerMkII,
        BattlecruiserMkII,
    ],
    [LifeformType.rocktal]: [
        CargoHoldExpansion_CivilianShips,
        IonCrystalEnhancement_HeavyFighter,
        ObsidianShieldReinforcement,
    ],
    [LifeformType.mechas]: [],
    [LifeformType.kaelesh]: [],
};
export const StatsBonusLifeformTechnologies = Object.values(StatsBonusLifeformTechnologiesByLifeform).flatMap(r => r);


export const LifeformTechnologiesByType: Record<LifeformTechnologyType, LifeformTechnology> = {
    [LifeformTechnologyType.intergalacticEnvoys]: IntergalacticEnvoys,
    [LifeformTechnologyType.highPerformanceExtractors]: HighPerformanceExtractors,
    [LifeformTechnologyType.fusionDrives]: FusionDrives,
    [LifeformTechnologyType.stealthFieldGenerator]: StealthFieldGenerator,
    [LifeformTechnologyType.orbitalDen]: OrbitalDen,
    [LifeformTechnologyType.researchAI]: ResearchAI,
    [LifeformTechnologyType.highPerformanceTerraformer]: HighPerformanceTerraformer,
    [LifeformTechnologyType.enhancedProductionTechnologies]: EnhancedProductionTechnologies,
    [LifeformTechnologyType.lightFighterMkII]: LightFighterMkII,
    [LifeformTechnologyType.cruiserMkII]: CruiserMkII,
    [LifeformTechnologyType.improvedLabTechnology]: ImprovedLabTechnology,
    [LifeformTechnologyType.plasmaTerraformer]: PlasmaTerraformer,
    [LifeformTechnologyType.lowTemperatureDrives]: LowTemperatureDrives,
    [LifeformTechnologyType.bomberMkII]: BomberMkII,
    [LifeformTechnologyType.destroyerMkII]: DestroyerMkII,
    [LifeformTechnologyType.battlecruiserMkII]: BattlecruiserMkII,
    [LifeformTechnologyType.robotAssistants]: RobotAssistants,
    [LifeformTechnologyType.supercomputer]: Supercomputer,

    [LifeformTechnologyType.volcanicBatteries]: VolcanicBatteries,
    [LifeformTechnologyType.acousticScanning]: AcousticScanning,
    [LifeformTechnologyType.highEnergyPumpSystems]: HighEnergyPumpSystems,
    [LifeformTechnologyType.cargoHoldExpansion_CivilianShips]: CargoHoldExpansion_CivilianShips,
    [LifeformTechnologyType.magmaPoweredProduction]: MagmaPoweredProduction,
    [LifeformTechnologyType.geothermalPowerPlants]: GeothermalPowerPlants,
    [LifeformTechnologyType.depthSounding]: DepthSounding,
    [LifeformTechnologyType.ionCrystalEnhancement_heavyFighter]: IonCrystalEnhancement_HeavyFighter,
    [LifeformTechnologyType.improvedStellarator]: ImprovedStellarator,
    [LifeformTechnologyType.hardenedDiamondDrillHeads]: HardenedDiamondDrillHeads,
    [LifeformTechnologyType.seismicMiningTechnology]: SeismicMiningTechnology,
    [LifeformTechnologyType.magmaPoweredPumpSystems]: MagmaPoweredPumpSystems,
    [LifeformTechnologyType.ionCrystalModules]: IonCrystalModules,
    [LifeformTechnologyType.optimisedSiloConstructionMethod]: OptimisedSiloConstructionMethod,
    [LifeformTechnologyType.diamondEnergyTransmitter]: DiamondEnergyTransmitter,
    [LifeformTechnologyType.obsidianShieldReinforcement]: ObsidianShieldReinforcement,
    [LifeformTechnologyType.runeShields]: RuneShields,
    [LifeformTechnologyType.rocktalCollectorEnhancement]: RocktalCollectorEnhancement,

    [LifeformTechnologyType.catalyserTechnology]: CatalyserTechnology,
    [LifeformTechnologyType.plasmaDrive]: PlasmaDrive,
    [LifeformTechnologyType.efficiencyModule]: EfficiencyModule,
    [LifeformTechnologyType.depotAI]: DepotAI,
    [LifeformTechnologyType.generalOverhaul_lightFighter]: GeneralOverhaul_LightFighter,
    [LifeformTechnologyType.automatedTransportLines]: AutomatedTransportLines,
    [LifeformTechnologyType.improvedDroneAI]: ImprovedDroneAI,
    [LifeformTechnologyType.experimentalRecyclingTechnology]: ExperimentalRecyclingTechnology,
    [LifeformTechnologyType.generalOverhaul_cruiser]: GeneralOverhaul_Cruiser,
    [LifeformTechnologyType.slingshotAutopilot]: SlingshotAutopilot,
    [LifeformTechnologyType.highTemperatureSuperconductors]: HighTemperatureSuperconductors,
    [LifeformTechnologyType.generalOverhaul_battleship]: GeneralOverhaul_Battleship,
    [LifeformTechnologyType.artificialSwarmIntelligence]: ArtificialSwarmIntelligence,
    [LifeformTechnologyType.generalOverhaul_battlecruiser]: GeneralOverhaul_Battlecruiser,
    [LifeformTechnologyType.generalOverhaul_bomber]: GeneralOverhaul_Bomber,
    [LifeformTechnologyType.generalOverhaul_destroyer]: GeneralOverhaul_Destroyer,
    [LifeformTechnologyType.experimentalWeaponsTechnology]: ExperimentalWeaponsTechnology,
    [LifeformTechnologyType.mechanGeneralEnhancement]: MechanGeneralEnhancement,

    [LifeformTechnologyType.heatRecovery]: HeatRecovery,
    [LifeformTechnologyType.sulphideProcess]: SulphideProcess,
    [LifeformTechnologyType.psionicNetwork]: PsionicNetwork,
    [LifeformTechnologyType.telekineticTractorBeam]: TelekineticTractorBeam,
    [LifeformTechnologyType.enhancedSensorTechnology]: EnhancedSensorTechnology,
    [LifeformTechnologyType.neuromodalCompressor]: NeuromodalCompressor,
    [LifeformTechnologyType.neuroInterface]: NeuroInterface,
    [LifeformTechnologyType.interplanetaryAnalysisNetwork]: InterplanetaryAnalysisNetwork,
    [LifeformTechnologyType.overclocking_heavyFighter]: Overclocking_HeavyFighter,
    [LifeformTechnologyType.telekineticDrive]: TelekineticDrive,
    [LifeformTechnologyType.sixthSense]: SixthSense,
    [LifeformTechnologyType.psychoharmoniser]: Psychoharmoniser,
    [LifeformTechnologyType.efficientSwarmIntelligence]: EfficientSwarmIntelligence,
    [LifeformTechnologyType.overclocking_largeCargo]: Overclocking_LargeCargo,
    [LifeformTechnologyType.gravitationSensors]: GravitationSensors,
    [LifeformTechnologyType.overclocking_battleship]: Overclocking_Battleship,
    [LifeformTechnologyType.psionicShieldMatrix]: PsionicShieldMatrix,
    [LifeformTechnologyType.kaeleshDiscovererEnhancement]: KaeleshDiscovererEnhancement,
};