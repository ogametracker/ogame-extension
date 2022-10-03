import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { BuildingTranslations } from "./types";

export const fr: BuildingTranslations = {
    [BuildingType.metalMine]: 'Mine de métal',
    [BuildingType.metalStorage]: 'Hangar de métal',
    [BuildingType.crystalMine]: 'Mine de cristal',
    [BuildingType.crystalStorage]: 'Hangar de cristal',
    [BuildingType.deuteriumSynthesizer]: 'Synthétiseur de deutérium',
    [BuildingType.deuteriumTank]: 'Réservoir de deutérium',
    [BuildingType.solarPlant]: 'Centrale électrique solaire',
    [BuildingType.fusionReactor]: 'Centrale électrique de fusion',
    [BuildingType.roboticsFactory]: 'Usine de robots',
    [BuildingType.naniteFactory]: 'Usine de nanites',
    [BuildingType.shipyard]: 'Chantier spatial',
    [BuildingType.spaceDock]: 'Dock spatial',
    [BuildingType.missileSilo]: 'Silo de missiles',
    [BuildingType.researchLab]: 'Laboratoire de recherche',
    [BuildingType.allianceDepot]: 'Dépôt de ravitaillement',
    [BuildingType.terraformer]: 'Terraformeur',
    [BuildingType.lunarBase]: 'Base lunaire',
    [BuildingType.sensorPhalanx]: 'Phalange de capteur',
    [BuildingType.jumpGate]: 'Porte de saut spatial',
};