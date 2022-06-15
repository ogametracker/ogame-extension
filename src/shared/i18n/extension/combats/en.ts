import { CombatResultType } from "@/shared/models/combat-reports/CombatResultType";
import { CombatsTranslations } from "./type";

export const en: CombatsTranslations = {
    header: 'Combats',
    tabHeaders: {
        overview: 'Overview',
        loot: 'Loot',
        lostShips: 'Lost Ships',
        subHeaders: {
            againstPlayers: 'Against Players',
            onExpeditions: 'On Expeditions',

            amount: 'Amount',
            resources: 'Resource Units'
        },
    },
    combats: 'Combats',
    shipsLost: 'Ships Lost',
    combatResults: {
        [CombatResultType.won]: 'Wins',
        [CombatResultType.lost]: 'Losses',
        [CombatResultType.draw]: 'Draws',
    },
};