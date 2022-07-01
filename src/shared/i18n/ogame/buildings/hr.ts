import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { BuildingTranslations } from "./types";

export const hr: BuildingTranslations = {
    [BuildingType.metalMine]: 'Rudnik metala',
    [BuildingType.metalStorage]: 'Spremnik metala',
    [BuildingType.crystalMine]: 'Rudnik kristala',
    [BuildingType.crystalStorage]: 'Spremnik kristala',
    [BuildingType.deuteriumSynthesizer]: 'Sintizer deuterija',
    [BuildingType.deuteriumTank]: 'Spremnik deuterija',
    [BuildingType.solarPlant]: 'Solarna elektrana',
    [BuildingType.fusionReactor]: 'Fuzijska elektrana',
    [BuildingType.roboticsFactory]: 'Tvornica robota',
    [BuildingType.naniteFactory]: 'Tvornica nanita',
    [BuildingType.shipyard]: 'Brodogradilište',
    [BuildingType.spaceDock]: 'Svemirsko Pristanište',
    [BuildingType.missileSilo]: 'Silos za rakete',
    [BuildingType.researchLab]: 'Centar za istraživanje',
    [BuildingType.allianceDepot]: 'Depo saveza',
    [BuildingType.terraformer]: 'Terraformer',
    [BuildingType.lunarBase]: 'Svemirska baza na mjesecu',
    [BuildingType.sensorPhalanx]: 'Senzorfalanga',
    [BuildingType.jumpGate]: 'Odskočna vrata',
};