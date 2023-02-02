import { ShipType } from "../../../models/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const el: ShipTranslations =  {
    [ShipType.lightFighter]: 'Ελαφρύ Μαχητικό',
    [ShipType.heavyFighter]: 'Βαρύ Μαχητικό',
    [ShipType.cruiser]: 'Καταδιωκτικό',
    [ShipType.battleship]: 'Καταδρομικό',
    [ShipType.battlecruiser]: 'Θωρηκτό Αναχαίτισης',
    [ShipType.bomber]: 'Βομβαρδιστικό',
    [ShipType.destroyer]: 'Destroyer',
    [ShipType.deathStar]: 'Deathstar',
    [ShipType.reaper]: 'Reaper',
    [ShipType.pathfinder]: 'Pathfinder',
    [ShipType.smallCargo]: 'Μικρό Μεταγωγικό',
    [ShipType.largeCargo]: 'Μεγάλο Μεταγωγικό',
    [ShipType.recycler]: 'Ανακυκλωτής',
    [ShipType.colonyShip]: 'Σκάφος Αποικιοποίησης',
    [ShipType.espionageProbe]: 'Κατασκοπευτικό Στέλεχος',
    [ShipType.crawler]: 'Crawler',
    [ShipType.solarSatellite]: 'Ηλιακοί Συλλέκτες',
};