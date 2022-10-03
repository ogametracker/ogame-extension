import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { BuildingTranslations } from "./types";

export const pl: BuildingTranslations = {
    [BuildingType.metalMine]: 'Kopalnia metalu',
    [BuildingType.metalStorage]: 'Magazyn metalu',
    [BuildingType.crystalMine]: 'Kopalnia kryształu',
    [BuildingType.crystalStorage]: 'Magazyn kryształu',
    [BuildingType.deuteriumSynthesizer]: 'Ekstraktor deuteru',
    [BuildingType.deuteriumTank]: 'Zbiornik deuteru',
    [BuildingType.solarPlant]: 'Elektrownia słoneczna',
    [BuildingType.fusionReactor]: 'Elektrownia fuzyjna',
    [BuildingType.roboticsFactory]: 'Fabryka robotów',
    [BuildingType.naniteFactory]: 'Fabryka nanitów',
    [BuildingType.shipyard]: 'Stocznia',
    [BuildingType.spaceDock]: 'Dok kosmiczny',
    [BuildingType.missileSilo]: 'Silos rakietowy',
    [BuildingType.researchLab]: 'Laboratorium badawcze',
    [BuildingType.allianceDepot]: 'Depozyt sojuszniczy',
    [BuildingType.terraformer]: 'Terraformer',
    [BuildingType.lunarBase]: 'Stacja księżycowa',
    [BuildingType.sensorPhalanx]: 'Falanga czujników',
    [BuildingType.jumpGate]: 'Teleporter',
};