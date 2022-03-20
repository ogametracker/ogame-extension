import { AllianceHistory } from './AllianceHistory';
import { PlayerHistory } from './PlayerHistory';

export interface UniverseHistory {
    lastUpdate: number;
    players: Record<number, PlayerHistory>;
    alliances: Record<number, AllianceHistory>;
}