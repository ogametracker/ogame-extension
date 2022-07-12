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