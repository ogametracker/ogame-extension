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
        info: {
            header: 'Info',

            topFinds: 'Top-Funde',
            possibleFinds: 'Liste möglicher Funde',
        },

        subHeaders: {
            amount: 'Menge',
            sizes: 'Fundgrößen',
            resources: 'Rohstoffeinheiten',
            count: 'Anzahl',
            sizesByResource: 'Fundgrößen nach Rohstoff',
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
        [ExpeditionEventType.combat]: 'Kampf',
        [ExpeditionEventType.item]: 'Item',
        [ExpeditionEventType.trader]: 'Händler',
        [ExpeditionEventType.lostFleet]: 'Flottenverlust',
    },
    expeditionEventSizes: {
        [ExpeditionEventSize.small]: 'normaler Fund',
        [ExpeditionEventSize.medium]: 'großer Fund',
        [ExpeditionEventSize.large]: 'riesiger Fund',
        'fled-death-star': 'Gegner sind geflohen',
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
    depletion: 'Systemauslastung',

    topFinds: {
        title: (type: string) => `Top-Funde (${type})`,
        shipUnits: 'Schiffseinheiten',
        shipAmount: 'Schiffsanzahl',

        size: 'Größe',
        amount: 'Menge',
        date: 'Datum',
    },
    possibleFinds: {
        info: {
            playerClass: 'Spieler-Klasse',
            economySpeed: 'Ökonomie-Geschwindigkeit',
            resourceFindBonus: 'Bonus Rohstofffunde',
            shipFindBonus: 'Bonus Schiffsfunde',
            darkMatterFindBonus: 'Bonus DM-Funde',
            discovererBonus: 'Bonus Entdeckerklasse',
        },

        maximumFinds: 'Maximalfunde',
        findsDarkMatter: 'Bereiche der DM-Funde',

        listOfPossibleFinds: 'Liste derzeit möglicher Funde (Rohstoffe, Schiffseinheiten)',
        findSizes: (size: string) => `Fundmengen (${size})`,
        shipUnits: 'Schiffseinheiten',
        shipMaxUnitsConverted: 'Max. Schiffseinheiten',
    },
};