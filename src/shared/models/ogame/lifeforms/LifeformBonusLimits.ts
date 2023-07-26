import { ExpeditionEventType } from "@/shared/models/expeditions/ExpeditionEventType";
import { BuildingType } from "../buildings/BuildingType";
import { ResearchType } from "../research/ResearchType";
import { LifeformBuildingType } from "./LifeformBuildingType";
import { LifeformTechnologyType } from "./LifeformTechnologyType";
import { LifeformBonusType, LifeformBonusTypeId } from "./LifeformBonusType";

export function getLifeformBonusLimit(bonus: LifeformBonusType): number | undefined {
    switch (bonus.type) {
        case LifeformBonusTypeId.FleetSpeedBonus:
            // uncapped
            return undefined;

        case LifeformBonusTypeId.ResourceProductionBonus:
            // production bonuses have no cap
            return undefined;

        case LifeformBonusTypeId.StatsBonus:
            // ship/defense bonuses have no cap
            return undefined;

            
        case LifeformBonusTypeId.TechTimeReduction:
            switch (bonus.tech) {
                case ResearchType.espionageTechnology:
                case ResearchType.computerTechnology:
                case ResearchType.weaponsTechnology:
                case ResearchType.shieldingTechnology:
                case ResearchType.armorTechnology:
                case ResearchType.energyTechnology:
                case ResearchType.hyperspaceTechnology:
                case ResearchType.combustionDrive:
                case ResearchType.impulseDrive:
                case ResearchType.hyperspaceDrive:
                case ResearchType.laserTechnology:
                case ResearchType.ionTechnology:
                case ResearchType.plasmaTechnology:
                case ResearchType.intergalacticResearchNetwork:
                case ResearchType.astrophysics:
                case ResearchType.gravitonTechnology:
                    return 0.99;

                case LifeformTechnologyType.intergalacticEnvoys:
                case LifeformTechnologyType.highPerformanceExtractors:
                case LifeformTechnologyType.fusionDrives:
                case LifeformTechnologyType.stealthFieldGenerator:
                case LifeformTechnologyType.orbitalDen:
                case LifeformTechnologyType.researchAI:
                case LifeformTechnologyType.highPerformanceTerraformer:
                case LifeformTechnologyType.enhancedProductionTechnologies:
                case LifeformTechnologyType.lightFighterMkII:
                case LifeformTechnologyType.cruiserMkII:
                case LifeformTechnologyType.improvedLabTechnology:
                case LifeformTechnologyType.plasmaTerraformer:
                case LifeformTechnologyType.lowTemperatureDrives:
                case LifeformTechnologyType.bomberMkII:
                case LifeformTechnologyType.destroyerMkII:
                case LifeformTechnologyType.battlecruiserMkII:
                case LifeformTechnologyType.robotAssistants:
                case LifeformTechnologyType.supercomputer:

                case LifeformTechnologyType.volcanicBatteries:
                case LifeformTechnologyType.acousticScanning:
                case LifeformTechnologyType.highEnergyPumpSystems:
                case LifeformTechnologyType.cargoHoldExpansion_CivilianShips:
                case LifeformTechnologyType.magmaPoweredProduction:
                case LifeformTechnologyType.geothermalPowerPlants:
                case LifeformTechnologyType.depthSounding:
                case LifeformTechnologyType.ionCrystalEnhancement_heavyFighter:
                case LifeformTechnologyType.improvedStellarator:
                case LifeformTechnologyType.hardenedDiamondDrillHeads:
                case LifeformTechnologyType.seismicMiningTechnology:
                case LifeformTechnologyType.magmaPoweredPumpSystems:
                case LifeformTechnologyType.ionCrystalModules:
                case LifeformTechnologyType.optimisedSiloConstructionMethod:
                case LifeformTechnologyType.diamondEnergyTransmitter:
                case LifeformTechnologyType.obsidianShieldReinforcement:
                case LifeformTechnologyType.runeShields:
                case LifeformTechnologyType.rocktalCollectorEnhancement:

                case LifeformTechnologyType.catalyserTechnology:
                case LifeformTechnologyType.plasmaDrive:
                case LifeformTechnologyType.efficiencyModule:
                case LifeformTechnologyType.depotAI:
                case LifeformTechnologyType.generalOverhaul_lightFighter:
                case LifeformTechnologyType.automatedTransportLines:
                case LifeformTechnologyType.improvedDroneAI:
                case LifeformTechnologyType.experimentalRecyclingTechnology:
                case LifeformTechnologyType.generalOverhaul_cruiser:
                case LifeformTechnologyType.slingshotAutopilot:
                case LifeformTechnologyType.highTemperatureSuperconductors:
                case LifeformTechnologyType.generalOverhaul_battleship:
                case LifeformTechnologyType.artificialSwarmIntelligence:
                case LifeformTechnologyType.generalOverhaul_battlecruiser:
                case LifeformTechnologyType.generalOverhaul_bomber:
                case LifeformTechnologyType.generalOverhaul_destroyer:
                case LifeformTechnologyType.experimentalWeaponsTechnology:
                case LifeformTechnologyType.mechanGeneralEnhancement:

                case LifeformTechnologyType.heatRecovery:
                case LifeformTechnologyType.sulphideProcess:
                case LifeformTechnologyType.psionicNetwork:
                case LifeformTechnologyType.telekineticTractorBeam:
                case LifeformTechnologyType.enhancedSensorTechnology:
                case LifeformTechnologyType.neuromodalCompressor:
                case LifeformTechnologyType.neuroInterface:
                case LifeformTechnologyType.interplanetaryAnalysisNetwork:
                case LifeformTechnologyType.overclocking_heavyFighter:
                case LifeformTechnologyType.telekineticDrive:
                case LifeformTechnologyType.sixthSense:
                case LifeformTechnologyType.psychoharmoniser:
                case LifeformTechnologyType.efficientSwarmIntelligence:
                case LifeformTechnologyType.overclocking_largeCargo:
                case LifeformTechnologyType.gravitationSensors:
                case LifeformTechnologyType.overclocking_battleship:
                case LifeformTechnologyType.psionicShieldMatrix:
                case LifeformTechnologyType.kaeleshDiscovererEnhancement:
                    return 0.99;

                case BuildingType.terraformer:
                case BuildingType.allianceDepot:
                case BuildingType.missileSilo:
                    return 0.99;

                case LifeformBuildingType.meditationEnclave:
                case LifeformBuildingType.crystalFarm:
                case LifeformBuildingType.runeTechnologium:
                case LifeformBuildingType.runeForge:
                case LifeformBuildingType.oriktorium:
                case LifeformBuildingType.magmaForge:
                case LifeformBuildingType.disruptionChamber:
                case LifeformBuildingType.megalith:
                case LifeformBuildingType.crystalRefinery:
                case LifeformBuildingType.deuteriumSynthesiser:
                case LifeformBuildingType.mineralResearchCentre:
                case LifeformBuildingType.advancedRecyclingPlant:
                    return 0.5;
            }
            return undefined;



        case LifeformBonusTypeId.TechCostReduction:
            switch (bonus.tech) {
                case ResearchType.espionageTechnology:
                case ResearchType.plasmaTechnology:
                case ResearchType.energyTechnology:
                case ResearchType.armorTechnology:
                case ResearchType.shieldingTechnology:
                case ResearchType.weaponsTechnology:
                    return 0.5;

                case LifeformTechnologyType.intergalacticEnvoys:
                case LifeformTechnologyType.highPerformanceExtractors:
                case LifeformTechnologyType.fusionDrives:
                case LifeformTechnologyType.stealthFieldGenerator:
                case LifeformTechnologyType.orbitalDen:
                case LifeformTechnologyType.researchAI:
                case LifeformTechnologyType.highPerformanceTerraformer:
                case LifeformTechnologyType.enhancedProductionTechnologies:
                case LifeformTechnologyType.lightFighterMkII:
                case LifeformTechnologyType.cruiserMkII:
                case LifeformTechnologyType.improvedLabTechnology:
                case LifeformTechnologyType.plasmaTerraformer:
                case LifeformTechnologyType.lowTemperatureDrives:
                case LifeformTechnologyType.bomberMkII:
                case LifeformTechnologyType.destroyerMkII:
                case LifeformTechnologyType.battlecruiserMkII:
                case LifeformTechnologyType.robotAssistants:
                case LifeformTechnologyType.supercomputer:

                case LifeformTechnologyType.volcanicBatteries:
                case LifeformTechnologyType.acousticScanning:
                case LifeformTechnologyType.highEnergyPumpSystems:
                case LifeformTechnologyType.cargoHoldExpansion_CivilianShips:
                case LifeformTechnologyType.magmaPoweredProduction:
                case LifeformTechnologyType.geothermalPowerPlants:
                case LifeformTechnologyType.depthSounding:
                case LifeformTechnologyType.ionCrystalEnhancement_heavyFighter:
                case LifeformTechnologyType.improvedStellarator:
                case LifeformTechnologyType.hardenedDiamondDrillHeads:
                case LifeformTechnologyType.seismicMiningTechnology:
                case LifeformTechnologyType.magmaPoweredPumpSystems:
                case LifeformTechnologyType.ionCrystalModules:
                case LifeformTechnologyType.optimisedSiloConstructionMethod:
                case LifeformTechnologyType.diamondEnergyTransmitter:
                case LifeformTechnologyType.obsidianShieldReinforcement:
                case LifeformTechnologyType.runeShields:
                case LifeformTechnologyType.rocktalCollectorEnhancement:

                case LifeformTechnologyType.catalyserTechnology:
                case LifeformTechnologyType.plasmaDrive:
                case LifeformTechnologyType.efficiencyModule:
                case LifeformTechnologyType.depotAI:
                case LifeformTechnologyType.generalOverhaul_lightFighter:
                case LifeformTechnologyType.automatedTransportLines:
                case LifeformTechnologyType.improvedDroneAI:
                case LifeformTechnologyType.experimentalRecyclingTechnology:
                case LifeformTechnologyType.generalOverhaul_cruiser:
                case LifeformTechnologyType.slingshotAutopilot:
                case LifeformTechnologyType.highTemperatureSuperconductors:
                case LifeformTechnologyType.generalOverhaul_battleship:
                case LifeformTechnologyType.artificialSwarmIntelligence:
                case LifeformTechnologyType.generalOverhaul_battlecruiser:
                case LifeformTechnologyType.generalOverhaul_bomber:
                case LifeformTechnologyType.generalOverhaul_destroyer:
                case LifeformTechnologyType.experimentalWeaponsTechnology:
                case LifeformTechnologyType.mechanGeneralEnhancement:

                case LifeformTechnologyType.heatRecovery:
                case LifeformTechnologyType.sulphideProcess:
                case LifeformTechnologyType.psionicNetwork:
                case LifeformTechnologyType.telekineticTractorBeam:
                case LifeformTechnologyType.enhancedSensorTechnology:
                case LifeformTechnologyType.neuromodalCompressor:
                case LifeformTechnologyType.neuroInterface:
                case LifeformTechnologyType.interplanetaryAnalysisNetwork:
                case LifeformTechnologyType.overclocking_heavyFighter:
                case LifeformTechnologyType.telekineticDrive:
                case LifeformTechnologyType.sixthSense:
                case LifeformTechnologyType.psychoharmoniser:
                case LifeformTechnologyType.efficientSwarmIntelligence:
                case LifeformTechnologyType.overclocking_largeCargo:
                case LifeformTechnologyType.gravitationSensors:
                case LifeformTechnologyType.overclocking_battleship:
                case LifeformTechnologyType.psionicShieldMatrix:
                case LifeformTechnologyType.kaeleshDiscovererEnhancement:
                    return 0.25;

                case BuildingType.metalMine:
                case BuildingType.crystalMine:
                case BuildingType.deuteriumSynthesizer:
                case BuildingType.solarPlant:
                case BuildingType.fusionReactor:
                case BuildingType.terraformer:
                case BuildingType.allianceDepot:
                case BuildingType.missileSilo:
                    return 0.5;

                case LifeformBuildingType.meditationEnclave:
                case LifeformBuildingType.crystalFarm:
                case LifeformBuildingType.runeTechnologium:
                case LifeformBuildingType.runeForge:
                case LifeformBuildingType.oriktorium:
                case LifeformBuildingType.magmaForge:
                case LifeformBuildingType.disruptionChamber:
                case LifeformBuildingType.megalith:
                case LifeformBuildingType.crystalRefinery:
                case LifeformBuildingType.deuteriumSynthesiser:
                case LifeformBuildingType.mineralResearchCentre:
                case LifeformBuildingType.advancedRecyclingPlant:
                    return 0.5;
            }
            return undefined;



        case LifeformBonusTypeId.DenCapacityBonus:
            // den capacity bonus has no cap
            return undefined;



        case LifeformBonusTypeId.CrawlerBonus:
            // crawler production bonus has no cap
            return undefined;

        case LifeformBonusTypeId.CrawlerEnergyConsumptionReduction:
            return 0.5;

        case LifeformBonusTypeId.PlayerClassBonus:
            // class bonuses have no cap
            return undefined;

        case LifeformBonusTypeId.FuelConsumptionReduction:
            return 0.3;

        case LifeformBonusTypeId.FuelReturn:
            return 0.9;

        case LifeformBonusTypeId.PhalanxRangeBonus:
            // uncapped
            return undefined;

        case LifeformBonusTypeId.ExpeditionEventProbabilityBonus:
            switch(bonus.event) {
                case ExpeditionEventType.lostFleet:
                    return 0.5;
            }
            return undefined;

        case LifeformBonusTypeId.ExpeditionBonus:
            // uncapped
            return undefined;

        case LifeformBonusTypeId.EnergyConsumptionReduction:
            return 0.4;

        case LifeformBonusTypeId.AutoRecycleDebrisField:
            return 0.3;

        case LifeformBonusTypeId.ShipProductionSpeedBonus:
            return 0.99; //TODO: only 70% for the Kaelesh building, why?

        case LifeformBonusTypeId.FoodConsumptionReduction:
            return 0.8;  //TODO: only 50% for the Kaelesh building, why?

        case LifeformBonusTypeId.MaxPopulationBonus:
            return 1.0;

        case LifeformBonusTypeId.PopulationGrowthBonus:
            // uncapped
            return undefined;

        case LifeformBonusTypeId.LifeformResearchBonusBoost:
            return 1.0;

        case LifeformBonusTypeId.PopulationProtection:
            return 0.8;

        case LifeformBonusTypeId.SpaceDockBonus:
            return 0.5;

        case LifeformBonusTypeId.PlanetFieldsBonus:
            // uncapped
            return undefined;

        case LifeformBonusTypeId.LifeformResearchPopulationConditionReduction:
            return 0.25;

        case LifeformBonusTypeId.MoonChanceBonus:
            return 0.3;

        default:
            throw new Error("invalid bonus type");
    }
}
