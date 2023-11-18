import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { BuildingTranslations } from "./types";

export const tr: BuildingTranslations = {
    [BuildingType.metalMine]: 'Metal Madeni',
    [BuildingType.metalStorage]: 'Metal Deposu',
    [BuildingType.crystalMine]: 'Kristal Madeni',
    [BuildingType.crystalStorage]: 'Kristal Deposu',
    [BuildingType.deuteriumSynthesizer]: 'Deuterium Sentezleyicisi',
    [BuildingType.deuteriumTank]: 'Deuterium Tankeri',
    [BuildingType.solarPlant]: 'Solar Enerji Santrali',
    [BuildingType.fusionReactor]: 'Füzyoenerji Santrali',
    [BuildingType.roboticsFactory]: 'Robot Fabrikası',
    [BuildingType.naniteFactory]: 'Nanit Fabrikasi',
    [BuildingType.shipyard]: 'Uzay Tersanesi',
    [BuildingType.spaceDock]: 'Uzay İskelesi',
    [BuildingType.missileSilo]: 'Roket Silosu',
    [BuildingType.researchLab]: 'Bilimsel Araştırma Laboratuvarı',
    [BuildingType.allianceDepot]: 'Ittifak Deposu',
    [BuildingType.terraformer]: 'Terraformer',
    [BuildingType.lunarBase]: 'Ay Merkez Istasyonu',
    [BuildingType.sensorPhalanx]: 'Radar Istasyonu',
    [BuildingType.jumpGate]: 'Siçrama Geçidi',
};