import { $i18n } from "@/shared/i18n/extension/$i18n";
import { LanguageKey } from "../../i18n/LanguageKey";
import { CombatResultType } from "../combat-reports/CombatResultType";
import { ExpeditionDepletionLevel } from "../expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../expeditions/ExpeditionEventType";
import { LifeformDiscoveryEventArtifactFindingSize } from "../lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize";
import { LifeformDiscoveryEventType } from "../lifeform-discoveries/LifeformDiscoveryEventType";
import { LifeformType } from "../ogame/lifeforms/LifeformType";
import { ResourceType } from "../ogame/resources/ResourceType";
import { ShipType } from "../ogame/ships/ShipType";
import { Settings } from "./Settings";

export function getDefaultSettings(language: LanguageKey): Settings {
    const oldLang = $i18n.locale;
    $i18n.locale = language;

    const defaultSettings: Settings = {
        dateRanges: [
            {
                label: $i18n.$t.extension.settings.dateRanges.defaultNames.today,
                type: 'day',
                skip: 0,
                take: 1,
            },
            {
                label: $i18n.$t.extension.settings.dateRanges.defaultNames.yesterday,
                type: 'day',
                skip: 1,
                take: 1,
            },
            {
                label: $i18n.$t.extension.settings.dateRanges.defaultNames.currentWeek,
                type: 'week',
                skip: 0,
                take: 1,
            },
            {
                label: $i18n.$t.extension.settings.dateRanges.defaultNames.lastWeek,
                type: 'week',
                skip: 1,
                take: 1,
            },
            {
                label: $i18n.$t.extension.settings.dateRanges.defaultNames.currentMonth,
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
            includeLostLootResources: true,
        },
        conversionRates: {
            mode: 'msu',
            msu: {
                crystal: 1.5,
                deuterium: 3,
            },
            dsu: {
                metal: 3,
                crystal: 2,
            },
        },
        showCellsWithConvertedResourceUnits: true,
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
                totalConverted: '#999999',
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
                depletion: {
                    [ExpeditionDepletionLevel.none]: '#00c23a',
                    [ExpeditionDepletionLevel.low]: '#fbbc04',
                    [ExpeditionDepletionLevel.medium]: '#ff5e00',
                    [ExpeditionDepletionLevel.high]: '#c72525',
                    unknown: '#404040',
                },
            },
            lifeformDiscoveries: {
                events: {
                    [LifeformDiscoveryEventType.nothing]: '#404040',
                    [LifeformDiscoveryEventType.lostShip]: '#d11515',
                    [LifeformDiscoveryEventType.knownLifeformFound]: '#33bcdb',
                    [LifeformDiscoveryEventType.newLifeformFound]: '#00c23a',
                    [LifeformDiscoveryEventType.artifacts]: '#fbbc04',
                },
                artifactFindingSizes: {
                    [LifeformDiscoveryEventArtifactFindingSize.small]: '#404040',
                    [LifeformDiscoveryEventArtifactFindingSize.medium]: '#3e85fe',
                    [LifeformDiscoveryEventArtifactFindingSize.large]: '#e01a76',
                    [LifeformDiscoveryEventArtifactFindingSize.storageFull]: '#d11515',
                },
            },
            lifeforms: {
                [LifeformType.humans]: '#7ec000',
                [LifeformType.rocktal]: '#df6642',
                [LifeformType.mechas]: '#4b91e7',
                [LifeformType.kaelesh]: '#9863e9',
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

    $i18n.locale = oldLang;

    return defaultSettings;
}