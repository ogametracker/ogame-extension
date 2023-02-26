import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { BuildingTranslations } from "./types";

export const ru: BuildingTranslations = {
    [BuildingType.metalMine]: 'Рудник по добыче металла',
    [BuildingType.metalStorage]: 'Хранилище металла',
    [BuildingType.crystalMine]: 'Рудник по добыче кристалла',
    [BuildingType.crystalStorage]: 'Хранилище кристалла',
    [BuildingType.deuteriumSynthesizer]: 'Синтезатор дейтерия',
    [BuildingType.deuteriumTank]: 'Ёмкость для дейтерия',
    [BuildingType.solarPlant]: 'Солнечная электростанция',
    [BuildingType.fusionReactor]: 'Термоядерная электростанция',
    [BuildingType.roboticsFactory]: 'Фабрика роботов',
    [BuildingType.naniteFactory]: 'Фабрика нанитов',
    [BuildingType.shipyard]: 'Верфь',
    [BuildingType.spaceDock]: 'Космический док',
    [BuildingType.missileSilo]: 'Ракетная шахта',
    [BuildingType.researchLab]: 'Исследовательская лаборатория',
    [BuildingType.allianceDepot]: 'Склад альянса',
    [BuildingType.terraformer]: 'Терраформер',
    [BuildingType.lunarBase]: 'Лунная база',
    [BuildingType.sensorPhalanx]: 'Сенсорная фаланга',
    [BuildingType.jumpGate]: 'Ворота',
};
