import { HistoryItem } from './HistoryItem';

export type AllianceState = null | 'deleted';
interface ScorePosition {
    score: number;
    position: number;
}
export interface AllianceHistory {
    id: number;
    /** state changes */
    state: HistoryItem<AllianceState>[];
    /** tag changes */
    tag: HistoryItem<string>[];
    /** name changes */
    name: HistoryItem<string>[];
    /** member changes */
    members: HistoryItem<number[]>[];
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
}