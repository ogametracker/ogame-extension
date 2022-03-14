import { ShipType } from "../../../models/v2/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const cz: ShipTranslations = {
    [ShipType.lightFighter]: 'Lehký stíhač',
    [ShipType.heavyFighter]: 'Těžký stíhač',
    [ShipType.cruiser]: 'Křižník',
    [ShipType.battleship]: 'Bitevní loď',
    [ShipType.battlecruiser]: 'Bitevní křižník',
    [ShipType.bomber]: 'Bombardér',
    [ShipType.destroyer]: 'Ničitel',
    [ShipType.deathStar]: 'Hvězda smrti',
    [ShipType.reaper]: 'Rozparovač',
    [ShipType.pathfinder]: 'Průzkumník',
    [ShipType.smallCargo]: 'Malý transportér',
    [ShipType.largeCargo]: 'Velký transportér',
    [ShipType.recycler]: 'Recyklátor',
    [ShipType.colonyShip]: 'Kolonizační loď',
    [ShipType.espionageProbe]: 'Špionážní sonda',
    [ShipType.crawler]: 'Crawler',
    [ShipType.solarSatellite]: 'Solární satelit',
};