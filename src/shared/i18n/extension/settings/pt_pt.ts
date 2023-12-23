import { RecursivePartial } from "@/shared/types/RecursivePartial";
import { SettingsTranslations } from "./type";

export const pt_pt: RecursivePartial<SettingsTranslations> = {
    tabs: {
        dateRanges: 'Intervalo de datas',
        colors: 'Cores',
        common: 'Comum',
        importExport: 'Importar/Exportar',
        expeditions: 'Expedições',
        combats: 'Combates',
        debrisFields: 'Campos de Destroços',
        resourceBalance: 'Resumo de Recursos',
        universeHistory: 'Histórico do Universo',
        dangerZone: 'Zona de Perigo',
        accessbility: 'Acessibilidade',
        linkAccounts: 'Linkar Contas',

        migrateOldData: 'Migrar dados antigos',
    },
    dateRanges: {
        defaultNames: {
            today: 'Hoje',
            yesterday: 'Ontem',
            currentWeek: 'Esta semana',
            lastWeek: 'Semana passada',
            currentMonth: 'Este mês',
            newRange: 'novo intervalo',
        },
        since: (date) => `Desde ${date}`,
        firstDayTemplate: '<primeiro dia>',
        headers: {
            label: 'Label',
            type: 'Tipo',
            rangeStart: 'Início do intervalo',
            rangeContains: 'Intervalo contem',
        },
        day: 'dia',
        days: 'dias',
        daysAgo: 'dias atrás',
        week: 'semana',
        weeks: 'semanas',
        weeksAgo: 'semanas atrás',
        month: 'mês',
        months: 'meses',
        monthsAgo: 'meses atrás',
        year: 'ano',
        years: 'anos',
        yearsAgo: 'anos atrás',
    },
    colors: {
        combatResults: 'Resultados do combate',
        expeditionEvents: 'Eventos de Expedição',
        expeditionEventSizes: 'Tamanhos dos eventos de Expedição',
        expeditionDepletionLevels: 'Desgaste do Sistema',
        lifeformDiscoveries: 'Descobertas de Formas de Vida',
        lifeforms: 'Formas de Vida',
        resources: 'Recursos',
        ships: 'Naves',
    },
    common: {
        conversionRates: {
            title: 'Taxas de conversão',
            msuLong: 'Converter para Metal',
            dsuLong: 'Converter para Deutério',
        },
        extensionLanguage: 'Idioma (dentro do OGame Tracker)',
        extensionLanguageFallbackHint: 'Textos serão mostrados em Inglês se não existir tradução para o idioma selecionado.',

        serverSettings: {
            title: 'Dados do Servidor',
            lastUpdate: 'Última Actualização',
            forceUpdate: 'Actualizar dados do servidor',
        },
    },
    expeditions: {
        resourceUnitFactorsOfShipFoundOnExpeditions: 'Factores de unidades de recursos das naves encontradas em expedições',
    },
    combats: {
        resourceUnitFactorsOfLostShips: 'Factor de unidades de recurso das naves perdidas em combate',
        ignoreEspionageCombats: {
            title: 'Ignorar combates de espionagem',
            label: 'Ignorar combates de espionagem para a monitorização dos combates',
        },
    },
    resourceBalance: {
        detailedResourceBalance: {
            header: 'Resumo detalhado dos Recursos',
            checkboxLabel: 'Mostrar resumo detalhado dos recursos',
        },
        includeShipsFoundOnExpeditions: {
            header: 'Naves encontradas em expedições',
            checkboxLabel: 'Incluir os recursos das naves encontradas em expedições no Resumo dos Recursos',
        },
        includeShipsLostInCombats: {
            header: 'Naves destruidas em combates',
            checkboxLabel: 'Incluir os recursos das naves perdidas em combate no Resumo dos Recursos',
        },
        includeLostLootResources: {
            header: 'Recursos perdidos em combates',
            checkboxLabel: 'Incluir os recursos perdidos em combate no Resumo dos Recursos',
        },
    },
    showConvertedUnitsInTables: {
        title: 'MSU/DSU em tabelas',
        label: 'Mostrar valores MSU/DSU convertidos nas tabelas',

        infoAmortization: 'Tempo de amortização, ainda assim, será calculado cusando o custo e produção em MSU/DSU',
    },

    reset: 'Restaurar definições',
    setDefaultRoute: 'Marcar como default',
    setDefaultSubRoute: 'Marcar como default para esta área',

    dangerZone: {
        doYouWantToContinue: 'TENS A CERTEZA QUE QUERES CONTINUAR?',

        deleteExpeditions: {
            button: (account: string) => `Apagar todas as expedições monitorizadas na conta actualmente selecionada (${account})`,
            confirmationText: (account: string, count: string) => `Se confirmares, todas as ${count} expedições monitorizadas serão apagadas da conta actualmente selecionada (${account}).`,
        },
        deleteCombats: {
            button: (account: string) => `Apagar todos os combates monitorizados na conta actualmente selecionada (${account})`,
            confirmationText: (account: string, count: string) => `Se confirmares, todos os ${count} combates monitorizados serão apagados da conta actualmente selecionda (${account}).`,
        },
        deleteDebrisFieldReports: {
            button: (account: string) => `Apagar todos os relatórios de reciclagem de campos de destroços monitorizados na conta actualmente selecionada (${account})`,
            confirmationText: (account: string, count: string) => `Se confirmares, todos os ${count} relatórios de reciclagem de campos de destroços serão apagados da conta actualmente selecionada (${account}).`,
        },
        deleteAccount: {
            button: (account: string) => `Apagar toda a informação da conta actualmente selecionada (${account})`,
            confirmationText: (account: string) => `Se confirmares, todos os dados da conta actualmente selecionada (${account}) serão apagados.\n`
                + `Isto inclui o histórico do universo se não existir outra conta monitorizada nesse universo.`,
        },
        deleteUniverseHistory: {
            button: (server: string) => `Apagar o histórico do universo da conta actualmente selecionada (${server})`,
            confirmationText: (server: string) => `Se confirmares, todo o histórico do universo da conta actualmente selecionada (${server}) será apagado.`,
        },
        deleteEverything: {
            button: 'Apagar todos os dados',
            confirmationText1: `Se confirmares, todos os dados serão apagados.\n`
                + 'Isto inclui to todos de todas as contas incluindo expedições, combates, reciclagem de campos de destroços, historico dos universos e mais.',
            confirmationText2: 'Confirma novamente que é para apagar todos os dados.',
        },
    },

    importExport: {
        export: {
            header: 'Exportar',
            description: 'Aqui podes exportar os teus dados. Irá incluir dados relevantes de todas as tuas contas monitorizadas e os seus servidores.',
            includeUniverseHistory: 'incluir o historico do universo no export (isto vai aumentar significativamente o tamanho do ficheiro assim como do tempo de importação!)',
            button: 'Iniciar exportação',
            wait: 'Aguarda enquanto os dados são preparados para a exportação...',

            errors: {
                unexpectedError: 'Ocorreu um erro inesperado durante a exportação dos teus dados.',
            },
        },
        import: {
            header: 'Importar',
            description: 'Aqui poderás importar os teus dados a partir de um ficheiro. Seleciona o ficheiro.',
            button: 'Iniciar importação',
            wait: 'Aguarda enquanto os teus dados são importados...',

            errors: {
                invalidFormat: 'O formato do ficheiro é inválido.',
                unexpectedError: 'Ocorreu um erro inesperado durante a importação dos teus dados.',
            },
        },

        importCallbacks: {
            importingSettings: 'A importar as tuas definições',
            importingBasicData: 'A importar a conta default e os dados do servidor',
            importingAccounts: 'A importar contas',
            importingUniverseHistories: 'A importar historico dos universos',
        },
    },
    accessibility: {
        showSimplifiedResults: {
            title: 'Vista simplificada',
            label: 'Vista simplificada, esconde as mensagens originais dos resultados das expedições e dos relatórios de reciclagem dos campos de destroços e mostra icons nas notificações.',
        },
    },

    debrisFields: {
        separateExpeditionDebrisFields: {
            title: 'Posição 16 separada',
            label: 'Separar as reciclagem dos campos de destroços da posição 16 das outras (1-15)',
        },
    },

    linkAccounts: {
        header: (account: string) => `Linkar contas com a conta actualmente selecionada (${account})`,
        descriptionHtml: (account: string) =>
            `Só deverás linkar contas se quiseres que o Ogame Tracker consider os dados das contas a link como dados da conta actualmente selecionada (${account}).<br/>`
            + `Isto é comum acontecer quando existe uma fusão de universos e as contas passam a ser consideradas outras pelo OGame Tracker.<br/><br/>`
            + `Examplo: <br/>`
            + `<ol>
                    <li>O jogador "OGame Professional" está a jogar no servidor "EN Milkyway"</li>
                    <li>O servidor "EN Milkyway" é tornado exodus durante a fusão</li>
                    <li>O jogador "OGame Professional" faz merge da sua conta para o servidor "EN Cartwheel"</li>   
                    <li>Depois do merge, o OGame Tracker não mostra quais quer dados do servidor original "EN Milkyway" para a nova conta que foi merged</li>
                    <li>No OGame Tracker a conta antigo "OGame Professional" no servidor "EN Milkyway" é linkada para nova conta "OGame Professional" no servidor "EN Cartwheel"</li>
                    <li>Os dados que foram enviados e guardados do antigo servidor "EN Milkyway" serão agora mostrados na nova conta no servidor "EN Cartwheel"</li>
                </ol>
            `,
        linkAccount: 'Linkar outra conta:',
        linkedAccounts: 'Contas linkadas:',
    },
};