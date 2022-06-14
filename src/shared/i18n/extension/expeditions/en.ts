import { ExpeditionEventSize } from "@/shared/models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "@/shared/models/expeditions/ExpeditionEventType";
import { ExpeditionsTranslations } from "./type";
import { en as ogamePremium } from '../../ogame/premium/en';
import { en as ogameFactions } from '../../ogame/factions/en';

export const en: ExpeditionsTranslations = {
    header: 'Expeditions',
    tabHeaders: {
        overview: 'Overview',
        foundResources: 'Resources',
        foundShips: 'Ships',
        foundDarkMatter: ogamePremium.darkMatter,
        foundItems: 'Items',

        subHeaders: {
            amount: 'Amount',
            sizes: 'Sizes',
            resources: 'Rsource Units',
        },
    },

    expeditionEvents: {
        [ExpeditionEventType.nothing]: 'no Event',
        [ExpeditionEventType.resources]: 'Resources',
        [ExpeditionEventType.fleet]: 'Ships',
        [ExpeditionEventType.delay]: 'Delay',
        [ExpeditionEventType.early]: 'Early',
        [ExpeditionEventType.darkMatter]: ogamePremium.darkMatter,
        [ExpeditionEventType.pirates]: ogameFactions.pirates,
        [ExpeditionEventType.aliens]: ogameFactions.aliens,
        [ExpeditionEventType.item]: 'Item',
        [ExpeditionEventType.trader]: 'Trader',
        [ExpeditionEventType.lostFleet]: 'Lost Fleet',
    },
    expeditionEventSizes: {
        [ExpeditionEventSize.small]: 'Common Find',
        [ExpeditionEventSize.medium]: 'Large Find',
        [ExpeditionEventSize.large]: 'Huge Find',
    },

    expeditions: 'Expeditions',
    finds: 'Finds',
    shipsFound: 'Ships found',
};