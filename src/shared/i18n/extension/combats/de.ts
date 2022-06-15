import { CombatResultType } from "@/shared/models/combat-reports/CombatResultType";
import { CombatsTranslations } from "./type";

export const de: CombatsTranslations = {
    header: 'Kämpfe',
    tabHeaders: {
        overview: 'Übersicht',
        loot: 'Beute',
        lostShips: 'Verlorenene Schiffe',
        subHeaders: {
            againstPlayers: 'Gegen Spieler',
            onExpeditions: 'Auf Expeditionen',

            amount: 'Menge',
            resources: 'Rohstoffeinheiten'
        },
    },
    combats: 'Kämpfe',
    shipsLost: 'verlorene Schiffe',
    combatResults: {
        [CombatResultType.won]: 'gewonnene Kämpfe',
        [CombatResultType.lost]: 'verlorene Kämpfe',
        [CombatResultType.draw]: 'Unentschieden',
    },
};