import { AllianceHistory } from './AllianceHistory';
import { PlayerHistory } from './PlayerHistory';

export interface UniverseHistory {
    lastUpdate: number;
    players: Partial<Record<number, PlayerHistory>>;
    alliances: Partial<Record<number, AllianceHistory>>;
}