import { ShipType } from "../../../models/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const fr: ShipTranslations = {
    [ShipType.lightFighter]: 'Chasseur léger',
    [ShipType.heavyFighter]: 'Chasseur lourd',
    [ShipType.cruiser]: 'Croiseur',
    [ShipType.battleship]: 'Vaisseau de bataille',
    [ShipType.battlecruiser]: 'Traqueur',
    [ShipType.bomber]: 'Bombardier',
    [ShipType.destroyer]: 'Destructeur',
    [ShipType.deathStar]: 'Étoile de la mort',
    [ShipType.reaper]: 'Faucheur',
    [ShipType.pathfinder]: 'Éclaireur',
    [ShipType.smallCargo]: 'Petit transporteur',
    [ShipType.largeCargo]: 'Grand transporteur',
    [ShipType.colonyShip]: 'Vaisseau de colonisation',
    [ShipType.recycler]: 'Recycleur',
    [ShipType.espionageProbe]: 'Sonde d`espionnage',
    [ShipType.solarSatellite]: 'Satellite solaire',
    [ShipType.crawler]: 'Foreuse',
};