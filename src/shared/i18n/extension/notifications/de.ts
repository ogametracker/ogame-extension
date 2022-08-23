import { NotificationTranslations } from "./type";

export const de: NotificationTranslations = {
    combatTracking: {
        title: (value: string) =>
            value == '1'
                ? `${value} neuer Kampfbericht getrackt`
                : `${value} neue Kampfberichte getrackt`,
        message: (value: string) =>
            value == '1'
                ? `Es wurde ${value} neuer Kampfbericht getrackt.`
                : `Es wurden ${value} neue Kampfberichte getrackt.`,
    },
    debrisFieldReportTracking: {
        title: (value: string) =>
            value == '1'
                ? `${value} neuer TF-Abbaubericht getrackt`
                : `${value} neue TF-Abbauberichte getrackt`,
        message: (value: string) =>
            value == '1'
                ? `Es wurde ${value} neuer TF-Abbaubericht getrackt.`
                : `Es wurden ${value} neue TF-Abbauberichte getrackt.`,
    },
    expeditionTracking: {
        fleetLost: {
            title: (value: string) =>
                value == '1'
                    ? `${value} Flottenverlust`
                    : `${value} Flottenverluste`,
            message: (value: string) =>
                value == '1'
                    ? `${value} Flotte ist nicht von ihrer Expedition zurückgekehrt.`
                    : `${value} Flotten sind nicht von ihrer Expedition zurückgekehrt.`,
        },
        result: {
            title: (value: string) =>
                value == '1'
                    ? `${value} neue Expedition getrackt`
                    : `${value} neue Expeditionen getrackt`,
            summary: 'Zusammenfassung der Funde',
            events: 'Expeditionsereignisse',
        },
    },
    lifeformDiscoveryTracking: {
        title: (value: string) =>
            value == '1'
                ? `${value} neue LF-Entdeckungsmission getrackt`
                : `${value} neue LF-Entdeckungsmissionen getrackt`,
        message: (value: string) =>
            value == '1'
                ? `${value} neue Lebensform-Entdeckungsmission wurde getrackt.`
                : `${value} neue Lebensform-Entdeckungsmissionen wurden getrackt.`,
    },

    messageTrackingError: {
        title: (value: string) =>
            value == '1'
                ? `Fehler beim Verarbeiten von ${value} Nachricht`
                : `Fehler beim Verarbeiten von ${value} Nachrichten`,
        message: (value: string) =>
            value == '1'
                ? `${value} Nachricht hat einen Fehler verursacht und wurde nicht getrackt. Die fehlerhafte Nachricht wurden rot markiert. Bitte kontaktiere den Entwickler.`
                : `${value} Nachrichten haben einen Fehler verursacht und wurden nicht getrackt. Die fehlerhaften Nachrichten wurden rot markiert. Bitte kontaktiere den Entwickler.`,
    },
};