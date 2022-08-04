import { ExpeditionEventSize } from "@/shared/models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "@/shared/models/expeditions/ExpeditionEventType";
import { ExpeditionsTranslations } from "./type";
import { de as ogamePremium } from '../../ogame/premium/de';
import { de as ogameFactions } from '../../ogame/factions/de';
import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";

export const de: ExpeditionsTranslations = {
    header: 'Expeditionen',
    tabHeaders: {
        overview: 'Übersicht',
        foundResources: 'Rohstofffunde',
        foundShips: 'Flottenfunde',
        foundDarkMatter: ogamePremium.darkMatter,
        foundItems: 'Itemfunde',
        depletion: 'Auslastung',

        subHeaders: {
            amount: 'Menge',
            sizes: 'Fundgrößen',
            resources: 'Rohstoffeinheiten',
        },
    },

    expeditionEvents: {
        [ExpeditionEventType.nothing]: 'ohne Ereignis',
        [ExpeditionEventType.resources]: 'Rohstofffund',
        [ExpeditionEventType.fleet]: 'Flottenfund',
        [ExpeditionEventType.delay]: 'Verspätung',
        [ExpeditionEventType.early]: 'Verfrühung',
        [ExpeditionEventType.darkMatter]: ogamePremium.darkMatter,
        [ExpeditionEventType.pirates]: ogameFactions.pirates,
        [ExpeditionEventType.aliens]: ogameFactions.aliens,
        [ExpeditionEventType.item]: 'Item',
        [ExpeditionEventType.trader]: 'Händler',
        [ExpeditionEventType.lostFleet]: 'Flottenverlust',
    },
    expeditionEventSizes: {
        [ExpeditionEventSize.small]: 'normaler Fund',
        [ExpeditionEventSize.medium]: 'großer Fund',
        [ExpeditionEventSize.large]: 'riesiger Fund',
    },
    depletionLevels: {
        [ExpeditionDepletionLevel.none]: 'Sehr Gering',
        [ExpeditionDepletionLevel.low]: 'Gering',
        [ExpeditionDepletionLevel.medium]: 'Mittel',
        [ExpeditionDepletionLevel.high]: 'Hoch',
        unknown: 'Unbekannt',
    },

    expeditions: 'Expeditionen',
    finds: 'Funde',
    shipsFound: 'Schiffe gefunden',
};