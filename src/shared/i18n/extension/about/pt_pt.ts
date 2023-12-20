import { RecursivePartial } from "@/shared/types/RecursivePartial";
import { AboutTranslations } from "./type";

export const pt_pt: RecursivePartial<AboutTranslations> = {
    faqHelp: {
        header: 'Ajuda',
        faq: {
            header: 'F.A.Q.',
            fleetLostOnExpedition: {
                header: 'Porque que é que as naves perdidas em expedições não são contabilizadas?',
                text: 'Contabilizar as naves perdidas em expedições requer fazer monitorização permanente a todas as frotas, o que não é possível.',
            },
            syncBetweenDevices: {
                header: 'Porque é que não existe sincronização dos meus dados entre vários dispositivos?',
                text: 'O Ogame Tracker guarda mais informação do que aquela que pode ser sincronizada usando a tua conta (Google, Microsoft, etc). A sincronização com um servidor externos poderá ser uma possibilidade no futuro.',
            },
            productionInResourceBalance: {
                header: 'Porque é que a estimativa de recursos não inclui a minha produção de recursos?',
                text: 'A tua produção de recursos depende de vários factores e seria necessário uma monitorização permanente. É possível mas a implementação desta funcionalidade é muito mais complexa do que a utilizade real para o jogador.',
            },
            whatAreAverages: {
                header: 'O que significa \'⌀ por dia\'?',
                text: 'Significa a média global de dias com pelo menos um evento.',
            },
        },
        tips: {
            header: 'Dicas',
            rightClickDefaultRoute: 'Podes usar o botão direito do ratona tab principal do lado esquerdo ou em qualquer sub-menu para o tornar como standard para a rota selecionada.',
            numbersKeyboardNavigation: 'Podes abrir as tab carregando no respectivo digito no teclado.',
            amortizationTable: {
                part1: 'Queres saber o que construir ou pesquisar para aumentar a tua produção de recursos da maneira mais eficiente? Tenta a\xa0',
                name: 'calculadora de amortização interactiva',
                part2: '.',
            },
            inlineSettings: 'Poderás altera as definições relacionadas clicando no ícone da roda dentada no lado direito.',
            switchAccountHtml: 'Poderás abrir o OGame Tracker para uma outra conta clicando no ícone <span class="mdi mdi-account-multiple"></span> e selecionando a respectiva conta.',
        },

        messageDiscord: {
            part1: 'Precisas de ajuda, encontraste um bug ou tens alguma funcionalidade que queiras ver implementada? Entra no\xa0',
            discordServer: 'Discord',
            part2: '\xa0e escreve uma mensagem no canal adequado.',
        },
    },
    info: {
        header: 'Info',
        table: {
            currentAccount: {
                header: 'Informação acerca da conta selecionada',
                numberOfTrackedExpeditions: 'Número de expedições monitorizadas',
                numberOfTrackedCombatReports: 'Número de relatórios de combate monitorizados ',
                numberOfTrackedDebrisFieldReports: 'Número de relatórios de reciclagem monitorizados',
                numberOfTrackedLifeformDiscoveries: 'Número de explorações monitorizadas',
                lastUpdateServerSettings: 'Última actualização das definições do servidor',
                numberOfUniverseHistoryEntries: 'Número de registos no historico do universo',
            },
            global: {
                header: 'Informação acerca de todos os dados no OGame Tracker',
                numberOfTrackedAccounts: 'Número de contas monitorizadas',
                estimatedSize: 'Tamanho dos dados guardados em disco',
            },
        },
    },
};
