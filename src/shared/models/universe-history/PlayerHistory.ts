import { PlanetHistory } from './PlanetHistory';

export type PlayerState = null | 'admin' | 'banned' | 'vacation' | 'inactive' | 'inactive-long' | 'deleted';

export interface PlayerHistory {
    id: number;
    /** name changes by datetime */
    name: Record<number, string>;
    /** score changes by datetime */
    scores: {
        total: Record<number, number>;
        economy: Record<number, number>;
        research: Record<number, number>;
        military: Record<number, number>;
        militaryBuilt: Record<number, number>;
        militaryDestroyed: Record<number, number>;
        militaryLost: Record<number, number>;
        honor: Record<number, number>;
        numberOfShips: Record<number, number>;
    };
    /** alliance changes by datetime */
    alliance: Record<number, number | null>;
    /** state changes by datetime */
    state: Record<number, PlayerState[]>;
    /** planet changes by datetime */
    planets: Record<number, PlanetHistory>;
}