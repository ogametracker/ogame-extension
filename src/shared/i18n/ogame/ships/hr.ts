import { ShipType } from "../../../models/v2/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const hr: ShipTranslations =  {
    [ShipType.lightFighter]: 'Mali lovac',
    [ShipType.heavyFighter]: 'Veliki lovac',
    [ShipType.cruiser]: 'Krstarice',
    [ShipType.battleship]: 'Borbeni brodovi',
    [ShipType.battlecruiser]: 'Oklopna krstarica',
    [ShipType.bomber]: 'Bombarder',
    [ShipType.destroyer]: 'Razaraci',
    [ShipType.deathStar]: 'Zvijezda smrti',
    [ShipType.reaper]: 'Žetelac',
    [ShipType.pathfinder]: 'Krčilac',
    [ShipType.smallCargo]: 'Mali transporter',
    [ShipType.largeCargo]: 'Veliki transporter',
    [ShipType.recycler]: 'Recikler',
    [ShipType.colonyShip]: 'Kolonijalni brod',
    [ShipType.espionageProbe]: 'Sonde za spijunazu',
    [ShipType.crawler]: 'Puzavac',
    [ShipType.solarSatellite]: 'Solarni satelit',
};