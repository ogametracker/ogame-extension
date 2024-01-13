import { CombatResultType } from "@/shared/models/combat-reports/CombatResultType";
import { CombatsTranslations } from "./type";
import { RecursivePartial } from "@/shared/types/RecursivePartial";

export const fr: RecursivePartial<CombatsTranslations> = {
    header: 'Combats',
    tabHeaders: {
        overview: 'Vue d\'ensemble',
        loot: 'Butin',
        lostShips: 'Vaisseaux perdus',
        subHeaders: {
            againstPlayers: 'Contre les joueurs',
            onExpeditions: 'En expéditions',

            amount: 'Quantité',
            resources: 'Unités de ressources'
        },
    },
    combats: 'Combats',
    shipsLost: 'Vaisseaux perdus',
    combatResults: {
        [CombatResultType.won]: 'Victoires',
        [CombatResultType.lost]: 'Défaites',
        [CombatResultType.draw]: 'Matchs nuls',
    },

};
