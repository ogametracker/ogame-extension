import { PlanetHistory } from './PlanetHistory';
import { HistoryItem } from './HistoryItem';

export type PlayerStateType = null | 'admin' | 'banned' | 'vacation' | 'inactive' | 'inactive-long' | 'outlaw' | 'deleted';
export type PlayerState = { 0: PlayerStateType } & PlayerStateType[];

export interface PlayerHistory {
    id: number;
    /** name changes */
    name: HistoryItem<string>[];
    /** score changes */
    scores: {
        total: HistoryItem<number>[];
        economy: HistoryItem<number>[];
        research: HistoryItem<number>[];
        military: HistoryItem<number>[];
        militaryBuilt: HistoryItem<number>[];
        militaryDestroyed: HistoryItem<number>[];
        militaryLost: HistoryItem<number>[];
        honor: HistoryItem<number>[];
        numberOfShips: HistoryItem<number>[];
    };
    /** score position changes */
    scorePositions: {
        total: HistoryItem<number>[];
        economy: HistoryItem<number>[];
        research: HistoryItem<number>[];
        military: HistoryItem<number>[];
        militaryBuilt: HistoryItem<number>[];
        militaryDestroyed: HistoryItem<number>[];
        militaryLost: HistoryItem<number>[];
        honor: HistoryItem<number>[];
        numberOfShips: HistoryItem<number>[];
    };
    /** alliance changes */
    alliance: HistoryItem<number | null>[];
    /** state changes */
    state: HistoryItem<PlayerState>[];
    /** planet changes by id */
    planets: Partial<Record<number, PlanetHistory>>;
}