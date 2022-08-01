import { $i18n } from "@/shared/i18n/extension/$i18n";
import { LanguageKey } from "../../i18n/LanguageKey";
import { CombatResultType } from "../combat-reports/CombatResultType";
import { ExpeditionEventSize } from "../expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../expeditions/ExpeditionEventType";
import { ResourceType } from "../ogame/resources/ResourceType";
import { ShipType } from "../ogame/ships/ShipType";
import { Settings } from "./Settings";

export function getDefaultSettings(language: LanguageKey): Settings {
    $i18n.locale = language;
    return {
        dateRanges: [
            {
                label: $i18n.$t.settings.dateRanges.defaultNames.today,
                type: 'day',
                skip: 0,
                take: 1,
            },
            {
                label: $i18n.$t.settings.dateRanges.defaultNames.yesterday,
                type: 'day',
                skip: 1,
                take: 1,
            },
            {
                label: $i18n.$t.settings.dateRanges.defaultNames.currentWeek,
                type: 'week',
                skip: 0,
                take: 1,
            },
            {
                label: $i18n.$t.settings.dateRanges.defaultNames.lastWeek,
                type: 'week',
                skip: 1,
                take: 1,
            },
            {
                label: $i18n.$t.settings.dateRanges.defaultNames.currentMonth,
                type: 'month',
                skip: 0,
                take: 1,
            },
            { type: 'all' },
        ],
        lostShipsResourceUnits: {
            factor: 1,
            deuteriumFactor: 1,
        },
        resourceBalance: {
            showDetailedBreakdown: false,
            includeExpeditionFoundShipsResourceUnits: true,
            includeLostShipsResourceUnits: true,
        },
        msuConversionRates: {
            crystal: 2,
            deuterium: 3,
        },
        showMsuCells: true,
        expeditionFoundShipsResourceUnits: {
            factor: 1,
            deuteriumFactor: 1,
        },
        extensionLanguage: language,
        defaultRoutes: {},
        colors: {
            combatResults: {
                [CombatResultType.won]: '#00c23a',
                [CombatResultType.draw]: '#aaaaaa',
                [CombatResultType.lost]: '#d11515',
            },
            resources: {
                [ResourceType.metal]: '#ff5e00',
                [ResourceType.crystal]: '#1a9fff',
                [ResourceType.deuterium]: '#1bee8f',
                totalMsu: '#999999',
            },
            ships: {
                [ShipType.lightFighter]: '#2472f3',
                [ShipType.heavyFighter]: '#c72525',
                [ShipType.cruiser]: '#fbbc04',
                [ShipType.battleship]: '#9ecc00',
                [ShipType.bomber]: '#00a95e',
                [ShipType.battlecruiser]: '#075263',
                [ShipType.destroyer]: '#de5200',
                [ShipType.reaper]: '#16a8d4',
                [ShipType.pathfinder]: '#ad135e',
                [ShipType.smallCargo]: '#888888',
                [ShipType.largeCargo]: '#ffffff',
                [ShipType.espionageProbe]: '#4b17da',
                [ShipType.deathStar]: '#262530',
                [ShipType.recycler]: '#8aff8e',
                [ShipType.colonyShip]: '#d7b58e',
                [ShipType.crawler]: '#94b4ff',
                [ShipType.solarSatellite]: '#dd94ff',
            },
            expeditions: {
                events: {
                    [ExpeditionEventType.nothing]: '#404040',
                    [ExpeditionEventType.resources]: '#2242e2',
                    [ExpeditionEventType.fleet]: '#dddddd',
                    [ExpeditionEventType.delay]: '#ff5e00',
                    [ExpeditionEventType.early]: '#00c23a',
                    [ExpeditionEventType.darkMatter]: '#33bcdb',
                    [ExpeditionEventType.pirates]: '#ffb592',
                    [ExpeditionEventType.aliens]: '#92ffdc',
                    [ExpeditionEventType.item]: '#6f23e1',
                    [ExpeditionEventType.trader]: '#fbbc04',
                    [ExpeditionEventType.lostFleet]: '#d11515',
                },
                sizes: {
                    [ExpeditionEventSize.small]: '#404040',
                    [ExpeditionEventSize.medium]: '#3e85fe',
                    [ExpeditionEventSize.large]: '#e01a76',
                },
            },
        },
        universeHistory: {
            updateTimes: [
                20 * 60 * 60 * 1000, // 20:00
            ],
            enabled: false,
            trackHistory: false,
        },
        combatTracking: {
            ignoreEspionageFights: true,
        },
        messageTracking: {
            showSimplifiedResults: true,
        },
        debrisFields: {
            separateExpeditionDebrisFields: false,
        },
    };
}