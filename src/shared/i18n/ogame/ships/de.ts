import { ShipType } from "../../../models/v1/ogame/ships/ShipType";
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
    [ShipType.recycler]: 'Recycler',
    [ShipType.colonyShip]: 'Kolonieschiff',
    [ShipType.espionageProbe]: 'Spionagesonde',
    [ShipType.crawler]: 'Crawler',
    [ShipType.solarSatellite]: 'Solarsatellit',
};