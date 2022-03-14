//#region INLINE TYPES
type DateRangeType = 'day' | 'week' | 'month' | 'year';
type FullDateRangeType = DateRangeType | 'all';
interface NormalDateRange {
    type: DateRangeType;
    skip: number;
    take: number;
    label: string;
}
interface AllDateRange {
    type: 'all';
    label?: undefined;
}
type DateRange = NormalDateRange | AllDateRange;
interface TableSettings {
    ranges: DateRange[];
}
interface ChartSettings {
    days: number;
    colors: ChartColorSettings;
}
type BattleResult = 'won' | 'lost' | 'draw';
type HexColor = string & `#${string}`;
interface ChartColorSettings {
    overview: OverviewChartColorSettings;
    resources: ResourcesChartColorSettings;
    ships: ShipsChartColorSettings;
    battleResults: Record<BattleResult, HexColor>;
}
enum ExpoType {
    nothing = 'nothing',
    resources = 'resources',
    fleet = 'fleet',
    delay = 'delay',
    early = 'early',
    darkMatter = 'darkMatter',
    pirates = 'pirates',
    aliens = 'aliens',
    item = 'item',
    trader = 'trader',
    lostFleet = 'lostFleet',
}
enum Resource {
    metal = 'metal',
    crystal = 'crystal',
    deuterium = 'deuterium',
}
enum Ship {
    lightFighter = 204,
    heavyFighter = 205,
    cruiser = 206,
    battleship = 207,
    bomber = 211,
    battlecruiser = 215,
    destroyer = 213,
    deathStar = 214,
    reaper = 218,
    pathfinder = 219,
    smallCargo = 202,
    largeCargo = 203,
    espionageProbe = 210,
    recycler = 209,
    colonyShip = 208,
    solarSatellite = 212,
    crawler = 217,
}
type OverviewChartColorSettings = Record<ExpoType, HexColor>;
type ResourcesChartColorSettings = Record<Resource, HexColor>;
type ShipsChartColorSettings = Record<Ship, HexColor>;
interface MsuConversionRates {
    [Resource.crystal]: number;
    [Resource.deuterium]: number;
}
enum LanguageKey {
    de = 'de',
    dk = 'dk',
    en = 'en',
    cz = 'cz',
    hr = 'hr',
}
interface Settings {
    tables: TableSettings;
    charts: ChartSettings;
    msuConversionRates: MsuConversionRates;

    language: LanguageKey;
}
//#endregion

import { _logDebug } from "../utils/_log";
import { MigrationFunction } from "./models";
import { SettingsManager } from "../../service-worker/settings/SettingsManager";
import { Settings as NewSettings } from "../models/settings/Settings";


const migrate: MigrationFunction = async () => {
    _logDebug('migrating from v1.1 to v2');

    const allData = await chrome.storage.local.get(null);
    const keyPrefixes = [
        ...new Set<string>(
            Object.keys(allData)
                .map(key => key.match(/^(?<prefix>s\d+-\w+-\d+)-.+$/)?.groups?.prefix)
                .filter(key => key != null) as string[]
        )
    ].filter(prefix => allData[`${prefix}-version`] == '1.1');

    for (const prefix of keyPrefixes) {
        _logDebug(`migrating from v1.1 to v2: '${prefix}'`);

        const settingsKey = `${prefix}-settings`;
        const versionKey = `${prefix}-version`;

        const settings = allData[settingsKey] as Settings | undefined;
        let newSettings: NewSettings = new SettingsManager('$$__migration-only__$$').getDefaultItem();

        if (settings != null) {
            newSettings = {
                ...newSettings,
                dateRanges: settings.tables.ranges,
                extensionLanguage: settings.language,
                msuConversionRates: settings.msuConversionRates,
                //we *could* migrate colors, but we chose not to because the new default colors are more "meaningful"
            };
        }

        await chrome.storage.local.set({
            [settingsKey]: newSettings,
            [versionKey]: '2.0',
        });
    }
};
export default migrate;