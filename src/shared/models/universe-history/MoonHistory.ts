import { HistoryItem } from './HistoryItem';

export type MoonState = null | 'deleted';

export interface MoonHistory {
    id: number;
    size: number;
    /** name changes */
    name: HistoryItem<string>[];
    /** state changes */
    state: HistoryItem<MoonState>[];
}