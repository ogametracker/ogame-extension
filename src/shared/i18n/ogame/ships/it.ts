import { ShipType } from "../../../models/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const it: ShipTranslations = {
    [ShipType.lightFighter]: 'Caccia Leggero',
    [ShipType.heavyFighter]: 'Caccia Pesante',
    [ShipType.cruiser]: 'Incrociatore',
    [ShipType.battleship]: 'Nave da battaglia',
    [ShipType.battlecruiser]: 'Incrociatore da Battaglia',
    [ShipType.bomber]: 'Bombardiere',
    [ShipType.destroyer]: 'Corazzata',
    [ShipType.deathStar]: 'Morte Nera',
    [ShipType.reaper]: 'Reaper',
    [ShipType.pathfinder]: 'Pathfinder',
    [ShipType.smallCargo]: 'Cargo leggero',
    [ShipType.largeCargo]: 'Cargo Pesante',
    [ShipType.colonyShip]: 'Colonizzatrice',
    [ShipType.recycler]: 'Riciclatrici',
    [ShipType.espionageProbe]: 'Sonda spia',
    [ShipType.solarSatellite]: 'Satellite Solare',
    [ShipType.crawler]: 'Crawler',
};