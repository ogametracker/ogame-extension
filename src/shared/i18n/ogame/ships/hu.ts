import { ShipType } from "../../../models/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const hu: ShipTranslations =  {
    [ShipType.lightFighter]: 'Könnyű Harcos',
    [ShipType.heavyFighter]: 'Nehéz Harcos',
    [ShipType.cruiser]: 'Cirkáló',
    [ShipType.battleship]: 'Csatahajó',
    [ShipType.battlecruiser]: 'Csatacirkáló',
    [ShipType.bomber]: 'Bombázó',
    [ShipType.destroyer]: 'Romboló',
    [ShipType.deathStar]: 'Halálcsillag',
    [ShipType.reaper]: 'Kaszás',
    [ShipType.pathfinder]: 'Felderítő',
    [ShipType.smallCargo]: 'Kis szállító',
    [ShipType.largeCargo]: 'Nagy Szállító',
    [ShipType.recycler]: 'Szemetesek',
    [ShipType.colonyShip]: 'Kolóniahajó',
    [ShipType.espionageProbe]: 'Kémszonda',
    [ShipType.crawler]: 'Crawler',
    [ShipType.solarSatellite]: 'Napműhold',
};