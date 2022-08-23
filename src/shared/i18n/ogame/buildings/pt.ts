import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { BuildingTranslations } from "./types";

export const pt: BuildingTranslations = {
    [BuildingType.metalMine]: 'Mina de Metal',
    [BuildingType.crystalMine]: 'Mina de Cristal',
    [BuildingType.deuteriumSynthesizer]: 'Sintetizador de Deutério',

    [BuildingType.metalStorage]: 'Armazém de Metal',
    [BuildingType.crystalStorage]: 'Armazém de Cristal',
    [BuildingType.deuteriumTank]: 'Tanque de Deutério',

    [BuildingType.solarPlant]: 'Planta de Energia Solar',
    [BuildingType.fusionReactor]: 'Planta de Fusão',

    [BuildingType.roboticsFactory]: 'Fábrica de Robots',
    [BuildingType.shipyard]: 'Hangar',
    [BuildingType.researchLab]: 'Laboratório de Pesquisas',
    [BuildingType.allianceDepot]: 'Depósito da Aliança',
    [BuildingType.missileSilo]: 'Silo de Mísseis',
    [BuildingType.naniteFactory]: 'Fábrica de Nanites',
    [BuildingType.terraformer]: 'Terra-Formador',
    [BuildingType.spaceDock]: 'Estaleiro Espacial',

    [BuildingType.lunarBase]: 'Base Lunar',
    [BuildingType.sensorPhalanx]: 'Sensor Phalanx',
    [BuildingType.jumpGate]: 'Portal de Salto Quântico',
};