import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { BuildingTranslations } from "./types";

export const ro: BuildingTranslations = {
    [BuildingType.metalMine]: 'Mina de Metal',
    [BuildingType.metalStorage]: 'Depozit de Metal',
    [BuildingType.crystalMine]: 'Mina de Cristal',
    [BuildingType.crystalStorage]: 'Depozit de Cristal',
    [BuildingType.deuteriumSynthesizer]: 'Sintetizator de Deuteriu',
    [BuildingType.deuteriumTank]: 'Bazin de Deuteriu',
    [BuildingType.solarPlant]: 'Uzina Solara',
    [BuildingType.fusionReactor]: 'Reactor de Fuziune',
    [BuildingType.roboticsFactory]: 'Uzina de Roboti',
    [BuildingType.naniteFactory]: 'Uzina de Naniti',
    [BuildingType.shipyard]: 'Santier Naval',
    [BuildingType.spaceDock]: 'Doc Spațial',
    [BuildingType.missileSilo]: 'Siloz de Rachete',
    [BuildingType.researchLab]: 'Laborator de Cercetari',
    [BuildingType.allianceDepot]: 'Hangarul Aliantei',
    [BuildingType.terraformer]: 'Formator de Sol',
    [BuildingType.lunarBase]: 'Baza Lunara',
    [BuildingType.sensorPhalanx]: 'Senzor Phalanx',
    [BuildingType.jumpGate]: 'Portal de Teleportare',
};