import { PlanetHistory } from './PlanetHistory';
import { HistoryItem } from './HistoryItem';

export type PlayerStateType = null | 'admin' | 'banned' | 'vacation' | 'inactive' | 'inactive-long' | 'outlaw' | 'deleted';
export type PlayerState = { 0: PlayerStateType } & PlayerStateType[];
interface ScorePosition {
    score: number;
    position: number;
}
export interface PlayerHistory {
    id: number;
    /** name changes */
    name: HistoryItem<string>[];
    /** score changes */
    scores: {
        total: HistoryItem<ScorePosition>[];
        economy: HistoryItem<ScorePosition>[];
        research: HistoryItem<ScorePosition>[];
        military: HistoryItem<ScorePosition>[];
        militaryBuilt: HistoryItem<ScorePosition>[];
        militaryDestroyed: HistoryItem<ScorePosition>[];
        militaryLost: HistoryItem<ScorePosition>[];
        honor: HistoryItem<ScorePosition>[];
        numberOfShips: HistoryItem<ScorePosition>[];
    };
    /** alliance changes */
    alliance: HistoryItem<number | null>[];
    /** state changes */
    state: HistoryItem<PlayerState>[];
    /** planet changes by id */
    planets: Partial<Record<number, PlanetHistory>>;
}