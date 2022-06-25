import { NotificationTranslations } from "./type";

export const en: NotificationTranslations = {
    combatTracking: {
        title: (value: string) =>
            value == '1'
                ? `${value} new combat report tracked`
                : `${value} new combat reports tracked`,
        message: (value: string) =>
            value == '1'
                ? `${value} new combat report has been tracked.`
                : `${value} new combat reports have been tracked.`,
    },
    debrisFieldReportTracking: {
        title: (value: string) =>
            value == '1'
                ? `${value} new debris field report tracked`
                : `${value} new debris field reports tracked`,
        message: (value: string) =>
            value == '1'
                ? `${value} new debris field report has been tracked.`
                : `${value} new debris field reports have been tracked.`,
    },
    expeditionTracking: {
        fleetLost: {
            title: (value: string) =>
                value == '1'
                    ? `${value} lost fleet`
                    : `${value} lost fleet`,
            message: (value: string) =>
                value == '1'
                    ? `${value} fleet did not return from its expedition.`
                    : `${value} fleets did not return from their expeditions.`,
        },
        result: {
            title: (value: string) =>
                value == '1'
                    ? `${value} new expedition tracked`
                    : `${value} new expeditions tracked`,
            summary: 'Summary of findings',
            events: 'Expedition events',
        },
    },

    messageTrackingError: {
        title: (value: string) =>
            value == '1'
                ? `Failed to process ${value} message`
                : `Failed to process ${value} messages`,
        message: (value: string) =>
            value == '1'
                ? `${value} message caused an error and has not been tracked. The causing message has been marked in red. Please contact the developer.`
                : `${value} messages caused an error and have not been tracked. The causing messages have been marked in red. Please contact the developer.`,
    },
};