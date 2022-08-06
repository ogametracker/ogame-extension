import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";

export interface LifeformDiscoveriesTranslations {
    header: string;
    tabHeaders: {
        discoveryResults: string;
        experience: string;
    };

    discoveryMissions: string;
    lifeformFound: string;
    eventTypes: Record<LifeformDiscoveryEventType, string>;
}