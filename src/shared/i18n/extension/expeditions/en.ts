import { ExpeditionEventSize } from "@/shared/models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "@/shared/models/expeditions/ExpeditionEventType";
import { ExpeditionsTranslations } from "./type";
import { en as ogamePremium } from '../../ogame/premium/en';
import { en as ogameFactions } from '../../ogame/factions/en';
import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";

export const en: ExpeditionsTranslations = {
    header: 'Expeditions',
    tabHeaders: {
        overview: 'Overview',
        foundResources: 'Resources',
        foundShips: 'Ships',
        foundDarkMatter: ogamePremium.darkMatter,
        foundItems: 'Items',
        depletion: 'Depletion',
        info: {
            header: 'Info',

            topFinds: 'Top Finds',
            possibleFinds: 'List of Possible Finds',
        },

        subHeaders: {
            amount: 'Amount',
            sizes: 'Sizes',
            resources: 'Resource Units',
            count: 'Count',
            sizesByResource: 'Sizes by Resource',
        },
    },

    expeditionEvents: {
        [ExpeditionEventType.nothing]: 'No Event',
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
        'fled-death-star': 'Enemies fled',
    },
    depletionLevels: {
        [ExpeditionDepletionLevel.none]: 'Very Low',
        [ExpeditionDepletionLevel.low]: 'Low',
        [ExpeditionDepletionLevel.medium]: 'Medium',
        [ExpeditionDepletionLevel.high]: 'High',
        unknown: 'Unknown',
    },

    expeditions: 'Expeditions',
    finds: 'Finds',
    shipsFound: 'Ships found',
    depletion: 'System depletion',

    topFinds: {
        title: (type: string) => `Top finds (${type})`,
        shipUnits: 'Ship units',
        shipUnitsIncludingDeuterium: 'Ship units incl. Deuterium',

        size: 'Size',
        amount: 'Amount',
        date: 'Date',
    },
    possibleFinds: {
        info: {
            playerClass: 'Player class',
            economySpeed: 'Economy speed',
            resourceFindBonus: 'Bonus resource finds',
            shipFindBonus: 'Bonus ship finds',
            darkMatterFindBonus: 'Bonus Dark Matter finds',
            discovererBonus: 'Discoverer class bonus',
        },

        maximumFinds: 'Maximum Finds',
        findsDarkMatter: 'Ranges of DM finds',

        listOfPossibleFinds: 'List of possible finds (resources, ship units)',
        findSizes: (size: string) => `Possible find amounts (${size})`,
        shipUnits: 'Ship units',
    },
};