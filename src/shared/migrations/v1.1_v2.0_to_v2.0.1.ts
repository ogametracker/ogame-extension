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
import { IDBPDatabase, openDB } from "idb";
import { CombatReport } from "../models/combat-reports/CombatReport";
import { DbVersion, OgameTrackerDbSchema } from "../db/OgameTrackerDbSchema";
import { DebrisFieldReport } from "../models/debris-field-reports/DebrisFieldReport";
import { ExpeditionEvent } from "../models/expeditions/ExpeditionEvents";


const migrate: MigrationFunction = async () => {
    _logDebug('migrating from v1.1 to v2');

    const allData = await chrome.storage.local.get(null);
    const keyPrefixes = [
        ...new Set<string>(
            Object.keys(allData)
                .map(key => key.match(/^(?<prefix>s\d+-\w+-\d+)-.+$/)?.groups?.prefix)
                .filter(key => key != null) as string[]
        )
    ].filter(prefix => allData[`${prefix}-version`] == '1.1' || allData[`${prefix}-version`] == '2.0');


    for (const prefix of keyPrefixes) {
        try {
            const version = allData[`${prefix}-version`];
            _logDebug(`migrating from v${version} to v2.0.1: '${prefix}'`);

            const db = await initDatabase(prefix);

            await migrateCombatReports(allData, prefix, db);
            await migrateDebrisFieldReports(allData, prefix, db);
            await migrateExpeditions(allData, prefix, db);

            if (version == '1.1') {
                await migrateSettings(allData, prefix);
            }

            // remove old server settings saved per user
            await chrome.storage.local.remove(`${prefix}-serverSettings`);

            // update version
            await chrome.storage.local.set({ [`${prefix}-version`]: '2.0.1' });
        }
        catch (error) {
            console.error(error);
            //TODO: handle migration error
        }
    }
};
export default migrate;

async function initDatabase(prefix: string) {
    const db = await openDB<OgameTrackerDbSchema>(prefix, DbVersion, {
        upgrade(db) {
            db.createObjectStore('combatReports', { keyPath: 'id' });
            db.createObjectStore('debrisFieldReports', { keyPath: 'id' });
            db.createObjectStore('expeditions', { keyPath: 'id' });
        },
        blocked() {
            throw new Error('db access blocked');
        },
        blocking() {
            throw new Error('db access blocking');
        },
        terminated() {
            throw new Error('db access terminated');
        },
    });

    return db;
}

async function migrateCombatReports(allData: Record<string, any>, prefix: string, db: IDBPDatabase<OgameTrackerDbSchema>) {
    const key = `${prefix}-battleReports`;
    const combatReports = Object.values(allData[key] ?? {}) as CombatReport[];

    const tx = db.transaction('combatReports', 'readwrite');
    for (const combatReport of combatReports) {
        await tx.objectStore('combatReports').put(combatReport);
    }
    await tx.done;

    //await chrome.storage.local.remove(key);
}


async function migrateDebrisFieldReports(allData: Record<string, any>, prefix: string, db: IDBPDatabase<OgameTrackerDbSchema>) {
    const key = `${prefix}-debrisFieldReports`;
    const debrisFieldReports = Object.values(allData[key] ?? {}) as DebrisFieldReport[];

    const tx = db.transaction('debrisFieldReports', 'readwrite');
    for (const report of debrisFieldReports) {
        await tx.objectStore('debrisFieldReports').put(report);
    }
    await tx.done;

    //await chrome.storage.local.remove(key);
}


async function migrateExpeditions(allData: Record<string, any>, prefix: string, db: IDBPDatabase<OgameTrackerDbSchema>) {
    const key = `${prefix}-expoEvents`;
    const expeditions = Object.values(allData[key] ?? {}) as ExpeditionEvent[];

    const tx = db.transaction('expeditions', 'readwrite');
    for (const expedition of expeditions) {
        await tx.objectStore('expeditions').put(expedition);
    }
    await tx.done;

    //await chrome.storage.local.remove(key);
}


async function migrateSettings(allData: Record<string, any>, prefix: string) {
    const key = `${prefix}-settings`;
    const settings = allData[key] as Settings | undefined;
    let newSettings = new SettingsManager('$$__migration-only__$$').getDefaultItem();

    if (settings != null) {
        newSettings = {
            ...newSettings,
            dateRanges: settings.tables.ranges,
            extensionLanguage: settings.language,
            msuConversionRates: settings.msuConversionRates,
            //we *could* migrate colors, but we chose not to because the new default colors are more "meaningful"
        };
    }

    await chrome.storage.local.set({ [key]: newSettings });
}
