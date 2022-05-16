import { DBSchema } from "idb";
import { CombatReport } from "../models/combat-reports/CombatReport";
import { DebrisFieldReport } from "../models/debris-field-reports/DebrisFieldReport";
import { ExpeditionEvent } from "../models/expeditions/ExpeditionEvents";

export interface OgameTrackerDbSchema extends DBSchema {
    combatReports: {
        key: number;
        value: CombatReport;
    };
    
    debrisFieldReports: {
        key: number;
        value: DebrisFieldReport;
    };

    expeditions: {
        key: number;
        value: ExpeditionEvent;
    };
}

export const DbVersion = 1;