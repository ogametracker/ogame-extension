import { ShipType } from "../../../models/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const de: ShipTranslations =  {
    [ShipType.lightFighter]: 'Leichter Jäger',
    [ShipType.heavyFighter]: 'Schwerer Jäger',
    [ShipType.cruiser]: 'Kreuzer',
    [ShipType.battleship]: 'Schlachtschiff',
    [ShipType.battlecruiser]: 'Schlachtkreuzer',
    [ShipType.bomber]: 'Bomber',
    [ShipType.destroyer]: 'Zerstörer',
    [ShipType.deathStar]: 'Todesstern',
    [ShipType.reaper]: 'Reaper',
    [ShipType.pathfinder]: 'Pathfinder',
    [ShipType.smallCargo]: 'Kleiner Transporter',
    [ShipType.largeCargo]: 'Großer Transporter',
    [ShipType.colonyShip]: 'Kolonieschiff',
    [ShipType.recycler]: 'Recycler',
    [ShipType.espionageProbe]: 'Spionagesonde',
    [ShipType.solarSatellite]: 'Solarsatellit',
    [ShipType.crawler]: 'Crawler',
};