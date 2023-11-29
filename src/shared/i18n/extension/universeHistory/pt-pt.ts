import { UniverseHistoryTranslations } from "./type";

export const pt-pt: UniverseHistoryTranslations = {
    header: 'Histórico do Universo',
    settings: {  
        messages: {
            notEnabledHtml: `
            <b>Monitorização do histórico das tabelas de pontuação não está activo.</b><br/>
            Activar esta funcionalidade fará com que as pontuações dos jogadores e alianças sejam monitorizados.`,
            historyTrackingNotEnabledHtml: `
            <b>Monitorização do histórico do universo não está activado.</b><br/>
            Activar esta funcionalidade fará com que todas as alterações a jogadores ou alianças seja monitorizada.<br/>
            Isto incluíra nomes de jogadores e alianças, tags de alianças, entradas e saídas de membros de alianças, 
            estados dos jogadores e alterações relativas a planetas e luas 
            incluindo nomes, coordenadas e abandonos/destruição de planetas e tuas .<br />
            <i>Isto irá gerar uma grande quantidade de dados!
            Poderás desactivar esta funcionalidade <a href="#/settings/universe-history">neste menu de definições</a>.</i>
            `,
            trackingTimesHtml: `
            Pelo menos uma vez por dia as pontuações e os dados do universo serão actualizados (se a funcionalidade estiver activa).<br/>
            Poderás ver o momento do update abaixo.
            Se uma actualização for perdida por algum motivo será feita novamente assim que possível.`
        },
        enableHighscoreTrackingOnly: 'Activar monitorização das pontuações do universo',
        enableHistoryTracking: 'Activar a monitorização do historico do universo',
    },

    tabs: {
        players: 'Jogadores',
        alliances: 'Alianças',

        subtabs: {
            highscore: 'Pontuações',
            history: 'Histórico',
        },
    },

    playerSelection: {
        header: 'Seleção de jogadores',
        search: 'procurar jogador',
    },
    allianceSelection: {
        header: 'Seleção de alianças',
        search: 'procurar aliança',
    },

    highscoreTabs: {
        total: 'Total',
        economy: 'Economia',
        research: 'Pesquisas',
        military: 'Militar',
        militaryBuilt: 'Militar construído',
        militaryDestroyed: 'Militar destruído',
        militaryLost: 'Militar perdido',
        honor: 'Honra',
        numberOfShips: 'Número de naves',
        lifeform: 'Formas de Vida',
        lifeformDiscoveries: 'Descobertas de Formas de Vida',
        lifeformEconomy: 'Economia de Formas de Vida',
        lifeformTechnology: 'Tecnologia de Formas de Vida',
    },
    historyTabs: {
        status: 'Estado',
        nicknames: 'Nicks',
        alliances: 'Alianças',
        planetAndMoons: 'Planetas e Luas',

        tags: 'Tags',
        names: 'Nomes',
        members: 'Membros',
    },

    noAlliance: 'Sem Aliança',
    today: 'hoje',
    name: 'Nome',
    tag: 'Tag',
    members: 'Membros',
    alliance: 'Aliança',
    from: 'De',
    until: 'Até',

    status: {
        active: 'Activo',
        vacation: 'Modo de Férias',
        inactive: 'Inactivo (>= 7 dias)',
        inactiveLong: 'Ianctivo (>= 28 dias)',
        banned: 'Banido',
        outlaw: 'Fora da Lei',
        deleted: 'Apagado',
        admin: 'Administrado',
    },

    loadingTakingLong: 'Carregar os dados está a demorar mais do que era esperado. A base de dados poderá está a ser actualizada neste momento. Espera um pouco mais ou tenta mais tarde.',
};