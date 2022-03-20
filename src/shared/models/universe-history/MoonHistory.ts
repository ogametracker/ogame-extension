export type MoonState = null | 'deleted';

export interface MoonHistory {
    id: number;
    size: number;
    /** name changes by datetime */
    name: Record<number, string>;
    /** state changes by datetime */
    state: Record<number, MoonState>;
}