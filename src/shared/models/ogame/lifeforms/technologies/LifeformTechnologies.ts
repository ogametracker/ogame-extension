import { LifeformTechnologyType } from "../LifeformTechnologyType";
import { LifeformType } from "../LifeformType";
import { EnhancedProductionTechnologies } from "./humans/EnhancedProductionTechnologies";
import { HighPerformanceExtractors } from "./humans/HighPerformanceExtractors";
import { CollectorClassBonusLifeformTechnology, CrawlerProductionBonusAndConsumptionReductionLifeformTechnology, ResourceProductionBonusLifeformTechnology } from "./interfaces";
import { Psychoharmoniser } from "./kaelesh/Psychoharmoniser";
import { SulphideProcess } from "./kaelesh/SulphideProcess";
import { LifeformTechnology } from "./LifeformTechnology";
import { ArtificialSwarmIntelligence } from "./mechas/ArtificialSwarmIntelligence";
import { AutomatedTransportLines } from "./mechas/AutomatedTransportLines";
import { CatalyserTechnology } from "./mechas/CatalyserTechnology";
import { AcousticScanning } from "./rocktal/AcousticScanning";
import { DepthSounding } from "./rocktal/DepthSounding";
import { GeothermalPowerPlants } from "./rocktal/GeothermalPowerPlants";
import { HardenedDiamondDrillHeads } from "./rocktal/HardenedDiamondDrillHeads";
import { HighEnergyPumpSystems } from "./rocktal/HighEnergyPumpSystems";
import { ImprovedStellarator } from "./rocktal/ImprovedStellarator";
import { IonCrystalModules } from "./rocktal/IonCrystalModules";
import { MagmaPoweredProduction } from "./rocktal/MagmaPoweredProduction";
import { MagmaPoweredPumpSystems } from "./rocktal/MagmaPoweredPumpSystems";
import { RocktalCollectorEnhancement } from "./rocktal/RocktalCollectorEnhancement";
import { SeismicMiningTechnology } from "./rocktal/SeismicMiningTechnology";
import { VolcanicBatteries } from "./rocktal/VolcanicBatteries";

export const ResourceProductionBonusLifeformTechnologiesByLifeform: Record<LifeformType, (LifeformTechnology & ResourceProductionBonusLifeformTechnology)[]> = {
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


export const CollectorClassBonusLifeformTechnologiesByLifeform: Record<LifeformType, (LifeformTechnology & CollectorClassBonusLifeformTechnology)[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [],
    [LifeformType.rocktal]: [
        RocktalCollectorEnhancement,
    ],
    [LifeformType.mechas]: [],
    [LifeformType.kaelesh]: [],
};
export const CollectorClassBonusLifeformTechnologies = Object.values(CollectorClassBonusLifeformTechnologiesByLifeform).flatMap(r => r);


export const CrawlerProductionBonusAndConsumptionReductionLifeformTechnologiesByLifeform: Record<LifeformType, (LifeformTechnology & CrawlerProductionBonusAndConsumptionReductionLifeformTechnology)[]> = {
    [LifeformType.none]: [],
    [LifeformType.humans]: [],
    [LifeformType.rocktal]: [
        IonCrystalModules,
    ],
    [LifeformType.mechas]: [],
    [LifeformType.kaelesh]: [],
};
export const CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies = Object.values(CrawlerProductionBonusAndConsumptionReductionLifeformTechnologiesByLifeform).flatMap(r => r);




export const LifeformTechnologiesByType: Record<LifeformTechnologyType, LifeformTechnology> = {
    [LifeformTechnologyType.intergalacticEnvoys]: null!, //TODO: 
    [LifeformTechnologyType.highPerformanceExtractors]: HighPerformanceExtractors,
    [LifeformTechnologyType.fusionDrives]: null!, //TODO: 
    [LifeformTechnologyType.stealthFieldGenerator]: null!, //TODO: 
    [LifeformTechnologyType.orbitalDen]: null!, //TODO: 
    [LifeformTechnologyType.researchAI]: null!, //TODO: 
    [LifeformTechnologyType.highPerformanceTerraformer]: null!, //TODO: 
    [LifeformTechnologyType.enhancedProductionTechnologies]: EnhancedProductionTechnologies,
    [LifeformTechnologyType.lightFighterMkII]: null!, //TODO: 
    [LifeformTechnologyType.cruiserMkII]: null!, //TODO: 
    [LifeformTechnologyType.improvedLabTechnology]: null!, //TODO: 
    [LifeformTechnologyType.plasmaTerraformer]: null!, //TODO: 
    [LifeformTechnologyType.lowTemperatureDrives]: null!, //TODO: 
    [LifeformTechnologyType.bomberMkII]: null!, //TODO: 
    [LifeformTechnologyType.destroyerMkII]: null!, //TODO: 
    [LifeformTechnologyType.battlecruiserMkII]: null!, //TODO: 
    [LifeformTechnologyType.robotAssistants]: null!, //TODO: 
    [LifeformTechnologyType.supercomputer]: null!, //TODO: 

    [LifeformTechnologyType.volcanicBatteries]: VolcanicBatteries,
    [LifeformTechnologyType.acousticScanning]: AcousticScanning,
    [LifeformTechnologyType.highEnergyPumpSystems]: HighEnergyPumpSystems,
    [LifeformTechnologyType.cargoHoldExpansion_CivilianShips]: null!, //TODO: 
    [LifeformTechnologyType.magmaPoweredProduction]: MagmaPoweredProduction,
    [LifeformTechnologyType.geothermalPowerPlants]: GeothermalPowerPlants,
    [LifeformTechnologyType.depthSounding]: DepthSounding,
    [LifeformTechnologyType.ionCrystalEnhancement_heavyFighter]: null!, //TODO: 
    [LifeformTechnologyType.improvedStellarator]: ImprovedStellarator,
    [LifeformTechnologyType.hardenedDiamondDrillHeads]: HardenedDiamondDrillHeads,
    [LifeformTechnologyType.seismicMiningTechnology]: SeismicMiningTechnology,
    [LifeformTechnologyType.magmaPoweredPumpSystems]: MagmaPoweredPumpSystems,
    [LifeformTechnologyType.ionCrystalModules]: IonCrystalModules,
    [LifeformTechnologyType.optimisedSiloConstructionMethod]: null!, //TODO: 
    [LifeformTechnologyType.diamondEnergyTransmitter]: null!, //TODO: 
    [LifeformTechnologyType.obsidianShieldReinforcement]: null!, //TODO: 
    [LifeformTechnologyType.runeShields]: null!, //TODO: 
    [LifeformTechnologyType.rocktalCollectorEnhancement]: RocktalCollectorEnhancement,

    [LifeformTechnologyType.catalyserTechnology]: CatalyserTechnology,
    [LifeformTechnologyType.plasmaDrive]: null!, //TODO: 
    [LifeformTechnologyType.efficiencyModule]: null!, //TODO: 
    [LifeformTechnologyType.depotAI]: null!, //TODO: 
    [LifeformTechnologyType.generalOverhaul_lightFighter]: null!, //TODO: 
    [LifeformTechnologyType.automatedTransportLines]: AutomatedTransportLines,
    [LifeformTechnologyType.improvedDroneAI]: null!, //TODO: 
    [LifeformTechnologyType.experimentalRecyclingTechnology]: null!, //TODO: 
    [LifeformTechnologyType.generalOverhaul_cruiser]: null!, //TODO: 
    [LifeformTechnologyType.slingshotAutopilot]: null!, //TODO: 
    [LifeformTechnologyType.highTemperatureSuperconductors]: null!, //TODO: 
    [LifeformTechnologyType.generalOverhaul_battleship]: null!, //TODO: 
    [LifeformTechnologyType.artificialSwarmIntelligence]: ArtificialSwarmIntelligence,
    [LifeformTechnologyType.generalOverhaul_battlecruiser]: null!, //TODO: 
    [LifeformTechnologyType.generalOverhaul_bomber]: null!, //TODO: 
    [LifeformTechnologyType.generalOverhaul_destroyer]: null!, //TODO: 
    [LifeformTechnologyType.experimentalWeaponsTechnology]: null!, //TODO: 
    [LifeformTechnologyType.mechanGeneralEnhancement]: null!, //TODO: 

    [LifeformTechnologyType.heatRecovery]: null!, //TODO: 
    [LifeformTechnologyType.sulphideProcess]: SulphideProcess,
    [LifeformTechnologyType.psionicNetwork]: null!, //TODO: 
    [LifeformTechnologyType.telekineticTractorBeam]: null!, //TODO: 
    [LifeformTechnologyType.enhancedSensorTechnology]: null!, //TODO: 
    [LifeformTechnologyType.neuromodalCompressor]: null!, //TODO: 
    [LifeformTechnologyType.neuroInterface]: null!, //TODO: 
    [LifeformTechnologyType.interplanetaryAnalysisNetwork]: null!, //TODO: 
    [LifeformTechnologyType.overclocking_heavyFighter]: null!, //TODO: 
    [LifeformTechnologyType.telekineticDrive]: null!, //TODO: 
    [LifeformTechnologyType.sixthSense]: null!, //TODO: 
    [LifeformTechnologyType.psychoharmoniser]: Psychoharmoniser,
    [LifeformTechnologyType.efficientSwarmIntelligence]: null!, //TODO: 
    [LifeformTechnologyType.overclocking_largeCargo]: null!, //TODO: 
    [LifeformTechnologyType.gravitationSensors]: null!, //TODO: 
    [LifeformTechnologyType.overclocking_battleship]: null!, //TODO: 
    [LifeformTechnologyType.psionicShieldMatrix]: null!, //TODO: 
    [LifeformTechnologyType.kaeleshDiscovererEnhancement]: null!, //TODO: 
};