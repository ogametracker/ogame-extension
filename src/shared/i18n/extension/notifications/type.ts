export interface NotificationTranslations {
    combatTracking: {
        title: (value: string) => string;
        message: (value: string) => string;
    };
    debrisFieldReportTracking: {
        title: (value: string) => string;
        message: (value: string) => string;
    };
    expeditionTracking: {
        fleetLost: {
            title: (value: string) => string;
            message: (value: string) => string;
        };
        result: {
            title: (value: string) => string;
            summary: string;
            events: string;
        };
    };

    messageTrackingError: {
        title: (value: string) => string;
        message: (value: string) => string;
    };
}