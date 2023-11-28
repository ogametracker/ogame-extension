import { CombatResultType } from "@/shared/models/combat-reports/CombatResultType";
import { CombatsTranslations } from "./type";

export const pt-pt: CombatsTranslations = {
    header: 'Combates',
    tabHeaders: {
        overview: 'Vista Geral',
        loot: 'Pilhagem',
        lostShips: 'Naves Perdidas',
        subHeaders: {
            againstPlayers: 'Contra Jogadoress',
            onExpeditions: 'Em Expedições',

            amount: 'Quantidade',
            resources: 'Unidades de Recursos'
        },
    },
    combats: 'Combates',
    shipsLost: 'Naves Perdidas',
    combatResults: {
        [CombatResultType.won]: 'Vitórias',
        [CombatResultType.lost]: 'Derrotas',
        [CombatResultType.draw]: 'Empates',
    },
};
