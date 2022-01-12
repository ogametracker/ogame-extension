import { ShipType } from "../../../models/v1/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const dk: ShipTranslations =  {
    [ShipType.lightFighter]: 'Lille Jæger',
    [ShipType.heavyFighter]: 'Stor Jæger',
    [ShipType.cruiser]: 'Krydser',
    [ShipType.battleship]: 'Slagskib',
    [ShipType.battlecruiser]: 'Interceptor',
    [ShipType.bomber]: 'Bomber',
    [ShipType.destroyer]: 'Destroyer',
    [ShipType.deathStar]: 'Dødsstjerne',
    [ShipType.reaper]: 'Reaper',
    [ShipType.pathfinder]: 'Stifinder',
    [ShipType.smallCargo]: 'Lille Transporter',
    [ShipType.largeCargo]: 'Stor Transporter',
    [ShipType.recycler]: 'Recycler',
    [ShipType.colonyShip]: 'Koloniskib',
    [ShipType.espionageProbe]: 'Spionagesonde',
    [ShipType.crawler]: 'Kravler',
    [ShipType.solarSatellite]: 'Solarsatellit',
};