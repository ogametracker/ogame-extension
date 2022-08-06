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
    lifeformDiscoveryTracking: {
        title: (value: string) => string;
        message: (value: string) => string;
    };

    messageTrackingError: {
        title: (value: string) => string;
        message: (value: string) => string;
    };
}