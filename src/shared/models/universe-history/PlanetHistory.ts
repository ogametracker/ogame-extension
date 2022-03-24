import { Coordinates } from '../ogame/common/Coordinates';
import { HistoryItem } from './HistoryItem';
import { MoonHistory } from './MoonHistory';

export type PlanetState = null | 'deleted';

export interface PlanetHistory {
    id: number;
    /** name changes */
    name: HistoryItem<string>[];
    /** state changes */
    state: HistoryItem<PlanetState>[];
    /** coordinates changes */
    coordinates: HistoryItem<Coordinates>[];
    /** moon changes by id */
    moon: Partial<Record<number, MoonHistory>>;
}