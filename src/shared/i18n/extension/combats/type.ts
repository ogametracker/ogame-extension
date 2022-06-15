import { CombatResultType } from "@/shared/models/combat-reports/CombatResultType"

export interface CombatsTranslations {
    header: string;
    tabHeaders: {
        overview: string;
        loot: string;
        lostShips: string;
        subHeaders: {
            againstPlayers: string;
            onExpeditions: string;

            amount: string;
            resources: string;
        };
    };
    shipsLost: string;
    combats: string;
    combatResults: Record<CombatResultType, string>;
}