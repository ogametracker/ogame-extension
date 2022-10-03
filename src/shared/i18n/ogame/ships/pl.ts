import { ShipType } from "../../../models/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const pl: ShipTranslations = {
    [ShipType.lightFighter]: 'Lekki myśliwiec',
    [ShipType.heavyFighter]: 'Ciężki myśliwiec',
    [ShipType.cruiser]: 'Krążownik',
    [ShipType.battleship]: 'Okręt wojenny',
    [ShipType.battlecruiser]: 'Pancernik',
    [ShipType.bomber]: 'Bombowiec',
    [ShipType.destroyer]: 'Niszczyciel',
    [ShipType.deathStar]: 'Gwiazda Śmierci',
    [ShipType.reaper]: 'Rozpruwacz',
    [ShipType.pathfinder]: 'Pionier',
    [ShipType.smallCargo]: 'Mały transporter',
    [ShipType.largeCargo]: 'Duży transporter',
    [ShipType.colonyShip]: 'Statek kolonizacyjny',
    [ShipType.recycler]: 'Recykler',
    [ShipType.espionageProbe]: 'Sonda szpiegowska',
    [ShipType.solarSatellite]: 'Satelita słoneczny',
    [ShipType.crawler]: 'Pełzacz',
};