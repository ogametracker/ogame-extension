import { ShipType } from "../../../models/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const da: ShipTranslations =  {
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