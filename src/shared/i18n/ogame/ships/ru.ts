import { ShipType } from "../../../models/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const ru: ShipTranslations =  {
    [ShipType.lightFighter]: 'Лёгкий истребитель',
    [ShipType.heavyFighter]: 'Тяжёлый истребитель',
    [ShipType.cruiser]: 'Крейсер',
    [ShipType.battleship]: 'Линкор',
    [ShipType.battlecruiser]: 'Линейный крейсер',
    [ShipType.bomber]: 'Бомбардировщик',
    [ShipType.destroyer]: 'Уничтожитель',
    [ShipType.deathStar]: 'Звезда смерти',
    [ShipType.reaper]: 'Жнец',
    [ShipType.pathfinder]: 'Первопроходец',
    [ShipType.smallCargo]: 'Малый транспорт',
    [ShipType.largeCargo]: 'Большой транспорт',
    [ShipType.recycler]: 'Колонизатор',
    [ShipType.colonyShip]: 'Переработчик',
    [ShipType.espionageProbe]: 'Шпионский зонд',
    [ShipType.crawler]: 'Гусеничник',
    [ShipType.solarSatellite]: 'Солнечный спутник',
};
