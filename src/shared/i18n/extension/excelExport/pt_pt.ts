import { RecursivePartial } from "@/shared/types/RecursivePartial";
import { ExcelExportTranslations } from "./type";

export const pt_pt: RecursivePartial<ExcelExportTranslations> = {
    header: 'Exportar para Excel',
    chooseBelowMessage: 'Escolhe que dados queres incluir na exportação:',
    groups: {
        expeditions: {
            header: 'Expedições',
            rawData: 'Dados em bruto (todos os registos guardados)',
            dailyOverview: 'Resumo dos resultados por dia',
            dailyDepletion: 'Resumo do desgaste do sistema por dia',
            dailyResources: 'Descobertas de recursos por dia',
            dailyResourceSizes: 'Tamanho das descobertas de recursos por dia',
            dailyShips: 'Descobertas de naves por dia',
            dailyShipSizes: 'Tamanho das descobertas de naves por dia',
            dailyDarkMatter: 'Descobertas de Matéria Negra por dia',
            dailyDarkMatterSizes: 'Tamanho das descobertas de Matéria Negra por dia',
        },
        combats: {
            header: 'Combates',
            rawData: 'Dados em bruto (todos os registos guardados)',
            dailyResults: 'Resultados dos comabtes por dia',
            dailyLoot: 'Montante de pilhagem por dia',
            dailyLostShips: 'Naves perdidas por dia',
        },
        debrisFields: {
            header: 'Campos de Destroços',
            rawData: 'Dados em bruto (todos os registos guardados)',
            dailyResources: 'Recursos reciclados por dia',
        },
        lifeformDiscoveries: {
            header: 'Missões de Descoberta',
            rawData: 'Dados em bruto (todos os registos guardados)',
            dailyExperience: 'Experiencia ganha por dia',
        },
    },
    generateButton: 'Gerar ficheiro de Excel',

    expeditions: {
        prefix: 'EX',

        sheets: {
            rawData: 'Dados em bruto',
            dailyDepletion: 'Desgaste diário do sistema',
            dailyResults: 'Resultados - diário',
            dailyResources: 'Recursos - diário',
            dailyResourcesSize: 'Recursos - diário (tamanhos)',
            dailyShips: 'Naves - diário',
            dailyShipsSize: 'Naves - diário (tamanho)',
            dailyDarkMatter: 'Matéria Negra - diário',
            dailyDarkMatterSize: 'Matéria Negra - diário (tamanho)',
        },

        eventType: 'Tipo',
        eventSize: 'Tamanho',
        item: 'Item',
    },
    combats: {
        prefix: 'CR',

        sheets: {
            rawData: 'Dados em bruto',
            dailyResults: 'Resultados - diário',
            dailyLoot: 'Pilhagem - diário',
            dailyLostShips: 'Naves perdidas - diário',
        },

        result: 'Resultado do combate',
        coordinates: 'Coordenadas',
        galaxy: 'Galáxia',
        system: 'Sistema',
        position: 'Posição',
        targetType: 'Tipo de alvo',
        combatType: 'Tipo de combate',
        expeditionCombatOpponent: 'Adversário de combate de expedição',
        loot: 'Pilhagem',
        lostShips: 'Naves Perdidas',
        debrisField: 'Campo de Destroços',
        moon: 'Lua',
        planet: 'Planeta',
        expeditionCombat: 'Combate de Expedição',
        playerCombat: 'Combate de Jogador',
        pirates: 'Piratas',
        aliens: 'Aliens',

        againstPlayers: 'Contra jogadores',
        onExpeditions: 'Em expedições',
    },
    debrisFields: {
        prefix: 'DF',

        sheets: {
            rawData: 'Dados em bruto',
            dailyResources: 'Recursos - diário',
        },
    },
    lifeformDiscoveries: {
        prefix: 'LF',

        sheets:{
            rawData: 'Dados em bruto',
            dailyExperience: 'Experiência - diário',
        },

        result: 'Descobertas',
        experience: 'Experiência',
        lifeform: 'Forma de Vida',
        artifacts: 'Artefactos',
        artifactsSize: 'Tamanho',
    },
};