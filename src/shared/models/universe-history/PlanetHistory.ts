import { Coordinates } from "../ogame/common/Coordinates";
import { MoonHistory } from './MoonHistory';

export type PlanetState = null | 'deleted';

export interface PlanetHistory {
    id: number;
    /** name changes by datetime */
    name: Record<number, string>;
    /** state changes by datetime */
    state: Record<number, PlanetState>;
    /** coordinates changes by datetime */
    coordinates: Record<number, Coordinates>;
    /** moon changes by datetime */
    moon: Record<number, MoonHistory>;
}