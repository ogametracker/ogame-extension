import { ShipType } from "../../../models/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const si: ShipTranslations =  {
    [ShipType.lightFighter]: 'Lahek lovec',
    [ShipType.heavyFighter]: 'Težki lovec',
    [ShipType.cruiser]: 'Križarka',
    [ShipType.battleship]: 'Bojna ladja',
    [ShipType.battlecruiser]: 'Bojna križarka',
    [ShipType.bomber]: 'Bombnik',
    [ShipType.destroyer]: 'Uničevalec',
    [ShipType.deathStar]: 'Zvezda smrti',
    [ShipType.reaper]: 'Kombajn',
    [ShipType.pathfinder]: 'Iskalec sledi',
    [ShipType.smallCargo]: 'Majhna tovorna ladja',
    [ShipType.largeCargo]: 'Velika tovorna ladja',
    [ShipType.recycler]: 'Recikler',
    [ShipType.colonyShip]: 'Kolonizacijska ladja',
    [ShipType.espionageProbe]: 'Vohunska sonda',
    [ShipType.crawler]: 'Plazilec',
    [ShipType.solarSatellite]: 'Sončni satelit',
};