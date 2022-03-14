import { ShipType } from "../ogame/ships/ShipType";
import { PlanetShipCount } from './PlanetShipCount';

export type MoonShipCount = Omit<PlanetShipCount, ShipType.crawler>;