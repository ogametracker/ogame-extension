import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { BuildingTranslations } from "./types";

export const nl: BuildingTranslations = {
    [BuildingType.metalMine]: 'Metaalmijn',
    [BuildingType.metalStorage]: 'Metaalopslag',
    [BuildingType.crystalMine]: 'Kristalmijn',
    [BuildingType.crystalStorage]: 'Kristalopslag',
    [BuildingType.deuteriumSynthesizer]: 'Deuteriumfabriek',
    [BuildingType.deuteriumTank]: 'Deuteriumtank',
    [BuildingType.solarPlant]: 'Zonne-energiecentrale',
    [BuildingType.fusionReactor]: 'Fusiecentrale',
    [BuildingType.roboticsFactory]: 'Robotfabriek',
    [BuildingType.naniteFactory]: 'Nanorobotfabriek',
    [BuildingType.shipyard]: 'Werf',
    [BuildingType.spaceDock]: 'Ruimtewerf',
    [BuildingType.missileSilo]: 'Raketsilo',
    [BuildingType.researchLab]: 'Onderzoekslab',
    [BuildingType.allianceDepot]: 'Alliantiehangar',
    [BuildingType.terraformer]: 'Terravormer',
    [BuildingType.lunarBase]: 'Maanbasis',
    [BuildingType.sensorPhalanx]: 'Sensorphalanx',
    [BuildingType.jumpGate]: 'Sprongpoort',
};