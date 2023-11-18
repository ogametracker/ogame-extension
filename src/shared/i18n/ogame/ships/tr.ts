import { ShipType } from "../../../models/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const tr: ShipTranslations =  {
    [ShipType.lightFighter]: 'Hafif Avcı',
    [ShipType.heavyFighter]: 'Ağır Avcı',
    [ShipType.cruiser]: 'Kruvazör',
    [ShipType.battleship]: 'Komuta Gemisi',
    [ShipType.battlecruiser]: 'Firkateyn',
    [ShipType.bomber]: 'Bombardıman Gemisi',
    [ShipType.destroyer]: 'Muhrip',
    [ShipType.deathStar]: 'Ölüm Yildizi',
    [ShipType.reaper]: 'Azrail',
    [ShipType.pathfinder]: 'Rehber',
    [ShipType.smallCargo]: 'Küçük Nakliye Gemisi',
    [ShipType.largeCargo]: 'Büyük Nakliye Gemisi',
    [ShipType.colonyShip]: 'Koloni Gemisi',
    [ShipType.recycler]: 'Geri Dönüsümcü',
    [ShipType.espionageProbe]: 'Casus Sondasi',
    [ShipType.solarSatellite]: 'Solar Uydu',
    [ShipType.crawler]: 'Paletli',
};