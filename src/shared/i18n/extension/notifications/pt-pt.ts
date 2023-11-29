import { NotificationTranslations } from "./type";

export const pt-pt: NotificationTranslations = {
    combatTracking: {
        title: (value: string) =>
            value == '1'
                ? `${value} novo relatorio de combate monitorizado`
                : `${value} novos relatórios de combate monitorizados`,
        message: (value: string) =>
            value == '1'
                ? `${value} novo relatorio de combate foi gravado.`
                : `${value} novos relatórios de combate foram gravados.`,
    },
    debrisFieldReportTracking: {
        title: (value: string) =>
            value == '1'
                ? `${value} novo campo de destroços monitorizado`
                : `${value} novos campos de destroços monitorizados`,
        message: (value: string) =>
            value == '1'
                ? `${value} novo campo de destroços foi gravado.`
                : `${value} novos campos de destroços foram gravados.`,
    },
    expeditionTracking: {
        fleetLost: {
            title: (value: string) =>
                value == '1'
                    ? `${value} frota perdida`
                    : `${value} frotas perdidas`,
            message: (value: string) =>
                value == '1'
                    ? `${value} frota não retornou da expedição.`
                    : `${value} frotas nao retornaram das expedições.`,
        },
        result: {
            title: (value: string) =>
                value == '1'
                    ? `${value} nova expedição monitorizada`
                    : `${value} novas expedições monitorizadas`,
            summary: 'Resumo das descobertas',
            events: 'Eventos de Expedições',
        },
    },
    lifeformDiscoveryTracking: {
        title: (value: string) =>
            value == '1'
                ? `${value} nova descoberta de forma de vida monitorizada`
                : `${value} novas descobertas de forma de vida monitorizadas`,
        message: (value: string) => 
        value == '1'
            ? `${value} nova descoberta de forma de vida guardada.`
            : `${value} novas descobertas de forma de vida guardadas.`,
    },

    messageTrackingError: {
        title: (value: string) =>
            value == '1'
                ? `Falhou o processamento de ${value} mensagem`
                : `Falhou o processamento de ${value} mensagens`,
        message: (value: string) =>
            value == '1'
                ? `${value} mensagem causou um erro e não foi monitorizada. A mensagem em causa foi marcada a vermelho. Contacta o developer via Discord.`
                : `${value} mensagens causaram um erro e não foram monitorizadas. As mensagens em causa doram marcadas a vermelho. Contacata o developer via Discord.`,
    },
};