export type AllianceState = null | 'deleted';

export interface AllianceHistory {
    id: number;
    /** state changes by datetime */
    state: Record<number, AllianceState>;
    /** tag changes by datetime */
    tag: Record<number, string>;
    /** name changes by datetime */
    name: Record<number, string>;
    /** member changes by datetime */
    members: Record<number, number[]>;
}