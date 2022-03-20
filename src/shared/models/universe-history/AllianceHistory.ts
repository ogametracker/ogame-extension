import { HistoryItem } from "./HistoryItem";

export type AllianceState = null | 'deleted';

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
}