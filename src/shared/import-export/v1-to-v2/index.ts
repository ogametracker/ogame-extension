import { CombatReport } from "../../models/combat-reports/CombatReport";
import { DebrisFieldReport } from "../../models/debris-field-reports/DebrisFieldReport";
import { ExpeditionEvent } from "../../models/expeditions/ExpeditionEvents";

export interface V1ToV2ExportedAccount {
    language: string;
    serverId: number;
    playerId: number;

    universeName: string;
    playerName: string;

    data: {
        expeditions: Record<number, ExpeditionEvent>;
        combatReports: Record<number, CombatReport>;
        debrisFieldReports: Record<number, DebrisFieldReport>;
    };
}

export interface V1ToV2Export {
    type: 'v1-to-v2-export';
    accounts: V1ToV2ExportedAccount[];
}