import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { BuildingTranslations } from "./types";

export const cz: BuildingTranslations = {
    [BuildingType.metalMine]: 'Důl na Kov',
    [BuildingType.crystalMine]: 'Důl na krystaly',
    [BuildingType.deuteriumSynthesizer]: 'Syntetizér deuteria',

    [BuildingType.metalStorage]: 'Sklad kovu',
    [BuildingType.crystalStorage]: 'Sklad krystalu',
    [BuildingType.deuteriumTank]: 'Nádrž na deuterium',

    [BuildingType.solarPlant]: 'Solární elektrárna',
    [BuildingType.fusionReactor]: 'Fúzní reaktor',

    [BuildingType.roboticsFactory]: 'Továrna na roboty',
    [BuildingType.shipyard]: 'Hangár',
    [BuildingType.researchLab]: 'Výzkumná laboratoř',
    [BuildingType.allianceDepot]: 'Alianční sklad',
    [BuildingType.missileSilo]: 'Raketové silo',
    [BuildingType.naniteFactory]: 'Továrna s nanoboty',
    [BuildingType.terraformer]: 'Terraformer',
    [BuildingType.spaceDock]: 'Vesmírný dok',

    [BuildingType.lunarBase]: 'Základna na měsíci',
    [BuildingType.sensorPhalanx]: 'Senzor falangy',
    [BuildingType.jumpGate]: 'Hyperprostorová brána',
};