import { ShipType } from "../../../models/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const ro: ShipTranslations =  {
    [ShipType.lightFighter]: 'Vanator usor',
    [ShipType.heavyFighter]: 'Vanator greu',
    [ShipType.cruiser]: 'Crucisator',
    [ShipType.battleship]: 'Nava de razboi',
    [ShipType.battlecruiser]: 'Interceptor',
    [ShipType.bomber]: 'Bombardier',
    [ShipType.destroyer]: 'Distrugator',
    [ShipType.deathStar]: 'RIP',
    [ShipType.reaper]: 'Reaper',
    [ShipType.pathfinder]: 'Pathfinder',
    [ShipType.smallCargo]: 'Transportor mic',
    [ShipType.largeCargo]: 'Transportor mare',
    [ShipType.colonyShip]: 'Nava de Colonizare',
    [ShipType.recycler]: 'Reciclator',
    [ShipType.espionageProbe]: 'Proba de spionaj',
    [ShipType.solarSatellite]: 'Satelit solar',
    [ShipType.crawler]: 'Crawler',
};