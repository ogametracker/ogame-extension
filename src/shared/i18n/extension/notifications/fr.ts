import { RecursivePartial } from "@/shared/types/RecursivePartial";
import { NotificationTranslations } from "./type";

export const fr: RecursivePartial<NotificationTranslations> = {
    combatTracking: {
        title: (value: string) =>
            value == '1'
                ? `${value} nouveau rapport de combat suivi`
                : `${value} nouveaux rapports de combat suivis`,
        message: (value: string) =>
            value == '1'
                ? `${value} nouveau rapport de combat a été suivi.`
                : `${value} nouveaux rapports de combat ont été suivis.`,
    },
    debrisFieldReportTracking: {
        title: (value: string) =>
            value == '1'
                ? `${value} nouveau rapport d'exploitation de champ de débris suivi`
                : `${value} nouveaux rapports d'exploitation de champ de débris suivis`,
        message: (value: string) =>
            value == '1'
                ? `${value} nouveau rapport d'exploitation de champ de débris a été suivi.`
                : `${value} nouveaux rapports d'exploitation de champ de débris ont été suivis.`,
    },
    expeditionTracking: {
        fleetLost: {
            title: (value: string) =>
                value == '1'
                    ? `${value} flotte perdue`
                    : `${value} flottes perdues`,
            message: (value: string) =>
                value == '1'
                    ? `${value} flotte n'est pas revenue de son expédition.`
                    : `${value} flottes ne sont pas revenues de leurs expéditions.`,
        },
        result: {
            title: (value: string) =>
                value == '1'
                    ? `${value} nouvelle expédition suivie`
                    : `${value} nouvelles expéditions suivies`,
            summary: 'Résumé des découvertes',
            events: 'Événements d\'expédition',
        },
    },
    lifeformDiscoveryTracking: {
        title: (value: string) =>
            value == '1'
                ? `${value} nouvelle mission de découverte de forme de vie suivie`
                : `${value} nouvelles missions de découverte de forme de vie suivies`,
        message: (value: string) =>
        value == '1'
            ? `${value} nouvelle mission de découverte de forme de vie a été suivie.`
            : `${value} nouvelles missions de découverte de forme de vie ont été suivies.`,
    },

    messageTrackingError: {
        title: (value: string) =>
            value == '1'
                ? `Échec du traitement de ${value} message`
                : `Échec du traitement de ${value} messages`,
        message: (value: string) =>
            value == '1'
                ? `${value} message a provoqué une erreur et n'a pas été suivi. Le message responsable a été marqué en rouge. Veuillez contacter le développeur.`
                : `${value} messages ont provoqué une erreur et n'ont pas été suivis. Les messages responsables ont été marqués en rouge. Veuillez contacter le développeur.`,
    },
};
