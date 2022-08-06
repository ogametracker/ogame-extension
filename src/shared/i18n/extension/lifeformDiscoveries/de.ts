import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { LifeformDiscoveriesTranslations } from "./type";

export const de:  LifeformDiscoveriesTranslations = {
    header: 'Missionen',
    tabHeaders: {
        discoveryResults: 'Ergebnisse',
        experience: 'Erfahrung',
    },
    eventTypes: {
        [LifeformDiscoveryEventType.nothing]: 'Kein Fund',
        [LifeformDiscoveryEventType.lostShip]: 'Schiff verloren',
        [LifeformDiscoveryEventType.newLifeformFound]: 'Neue Lebensform',
        [LifeformDiscoveryEventType.knownLifeformFound]: 'Lebensform-Erfahrung',
    },
    discoveryMissions: 'Entdeckungsmissionen',
    lifeformFound: 'Lebensform gefunden',
};