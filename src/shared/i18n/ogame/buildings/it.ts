import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { BuildingTranslations } from "./types";

export const it: BuildingTranslations = {
    [BuildingType.metalMine]: 'Miniera di Metallo',
    [BuildingType.metalStorage]: 'Deposito di metallo',
    [BuildingType.crystalMine]: 'Miniera di Cristalli',
    [BuildingType.crystalStorage]: 'Deposito di cristalli',
    [BuildingType.deuteriumSynthesizer]: 'Sintetizzatore di deuterio',
    [BuildingType.deuteriumTank]: 'Cisterna di deuterio',
    [BuildingType.solarPlant]: 'Centrale solare',
    [BuildingType.fusionReactor]: 'Centrale a Fusione',
    [BuildingType.roboticsFactory]: 'Fabbrica dei Robot',
    [BuildingType.naniteFactory]: 'Fabbrica dei Naniti',
    [BuildingType.shipyard]: 'Cantiere Spaziale',
    [BuildingType.spaceDock]: 'Porto Spaziale',
    [BuildingType.missileSilo]: 'Base missilistica',
    [BuildingType.researchLab]: 'Laboratorio di Ricerca',
    [BuildingType.allianceDepot]: 'Base di appoggio',
    [BuildingType.terraformer]: 'Terraformer',
    [BuildingType.lunarBase]: 'Avamposto lunare',
    [BuildingType.sensorPhalanx]: 'Falange di sensori',
    [BuildingType.jumpGate]: 'Portale iperspaziale',
};