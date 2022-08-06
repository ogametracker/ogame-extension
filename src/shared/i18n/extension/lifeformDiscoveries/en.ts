import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { LifeformDiscoveriesTranslations } from "./type";

export const en: LifeformDiscoveriesTranslations = {
    header: 'Missions',
    tabHeaders: {
        discoveryResults: 'Results',
        experience: 'Experience',
    },
    eventTypes: {
        [LifeformDiscoveryEventType.nothing]: 'No finding',
        [LifeformDiscoveryEventType.lostShip]: 'Lost exploration ship',
        [LifeformDiscoveryEventType.newLifeformFound]: 'New lifeform',
        [LifeformDiscoveryEventType.knownLifeformFound]: 'Lifeform experience',
    },
    discoveryMissions: 'Discovery Missions',
    lifeformFound: 'Lifeform found',
};