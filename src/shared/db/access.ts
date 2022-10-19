import { IDBPDatabase, IDBPTransaction, openDB, StoreNames, unwrap } from "idb";
import { MessageOgameMeta } from "../messages/Message";
import { _throw } from "../utils/_throw";
import { DbVersion, OgameTrackerGlobalDbSchema, OgameTrackerPlayerDbSchema, OgameTrackerServerDbSchema, OgameTrackerUniverseHistoryDbSchema } from "./schema";

const databases: Partial<Record<string, Promise<IDBPDatabase<any>>>> = {};

export function dropDatabaseConnections() {
    for (const key of Object.keys(databases)) {
        delete databases[key];
    }
}

async function getDatabase<TSchema>(
    name: string,
    upgrade: (db: IDBPDatabase<TSchema>, oldVersion: number, newVersion: number | null, transaction: IDBPTransaction<TSchema, StoreNames<TSchema>[], "versionchange">) => void
): Promise<IDBPDatabase<TSchema>> {

    let dbPromise = databases[name];
    if (dbPromise == null) {
        databases[name] = dbPromise = openDB<TSchema>(name, DbVersion, { upgrade });
        const db = await dbPromise;
        db.addEventListener('close', ev => delete databases[name]);
    }

    return await dbPromise;
}

export function getPlayerDatabaseName(meta: MessageOgameMeta): string {
    if(meta.serverId <= 0) {
        _throw('Server ID is 0 or less');
    }
    if(meta.playerId <= 0) {
        _throw('Player ID is 0 or less');
    }
    return `s${meta.serverId}-${meta.language}-${meta.playerId}`;
}
export async function getPlayerDatabase(meta: MessageOgameMeta): Promise<IDBPDatabase<OgameTrackerPlayerDbSchema>> {
    const name = getPlayerDatabaseName(meta);
    return await getDatabase(name, (db, oldVersion, newVersion, tx) => {
        if (oldVersion < 1) {
            db.createObjectStore('combatReports', { keyPath: 'id' });
            db.createObjectStore('debrisFieldReports', { keyPath: 'id' });
            db.createObjectStore('expeditions', { keyPath: 'id' });
            db.createObjectStore('empire');
        }
        if(oldVersion < 3) {
            db.createObjectStore('universeSpecificSettings');
        }
        if(oldVersion < 7) {
            db.createObjectStore('lifeformDiscoveries', { keyPath: 'id' });
        }
        if(oldVersion < 8) {
            db.createObjectStore('combatReports.ignored');
        }
    });
}


export function getServerDatabaseName(meta: MessageOgameMeta): string {
    if(meta.serverId <= 0) {
        _throw('Server ID is 0 or less');
    }
    return `s${meta.serverId}-${meta.language}`;
}
export async function getServerDatabase(meta: MessageOgameMeta): Promise<IDBPDatabase<OgameTrackerServerDbSchema>> {
    const name = getServerDatabaseName(meta);
    return await getDatabase(name, (db, oldVersion, newVersion, tx) => {
        if (oldVersion < 1) {
            db.createObjectStore('serverSettings');
        }
    });
}

export function getUniverseHistoryDatabaseName(meta: MessageOgameMeta): string {
    if(meta.serverId <= 0) {
        _throw('Server ID is 0 or less');
    }
    return `s${meta.serverId}-${meta.language}.universeHistory`;
}
export async function getUniverseHistoryDatabase(meta: MessageOgameMeta): Promise<IDBPDatabase<OgameTrackerUniverseHistoryDbSchema>> {
    const name = getUniverseHistoryDatabaseName(meta);
    return await getDatabase(name, (db, oldVersion, newVersion, tx) => {
        if (oldVersion < 1) {
            db.createObjectStore('_lastUpdate');

            db.createObjectStore('alliances', { keyPath: 'id' });
            db.createObjectStore('allianceTags', { keyPath: ['allianceId', 'date'] })
                .createIndex('allianceId', 'allianceId');
            db.createObjectStore('allianceNames', { keyPath: ['allianceId', 'date'] })
                .createIndex('allianceId', 'allianceId');
            db.createObjectStore('allianceMembers', { keyPath: ['allianceId', 'date'] })
                .createIndex('allianceId', 'allianceId');
            db.createObjectStore('allianceStates', { keyPath: ['allianceId', 'date'] })
                .createIndex('allianceId', 'allianceId');
            db.createObjectStore('allianceScores', { keyPath: ['allianceId', 'date', 'type'] })
                .createIndex('allianceId', 'allianceId');

            db.createObjectStore('players', { keyPath: 'id' });
            db.createObjectStore('playerNames', { keyPath: ['playerId', 'date'] })
                .createIndex('playerId', 'playerId');
            db.createObjectStore('playerStates', { keyPath: ['playerId', 'date'] })
                .createIndex('playerId', 'playerId');
            db.createObjectStore('playerAlliances', { keyPath: ['playerId', 'date'] })
                .createIndex('playerId', 'playerId');
            db.createObjectStore('playerScores', { keyPath: ['playerId', 'date', 'type'] })
                .createIndex('playerId', 'playerId');

            db.createObjectStore('planets', { keyPath: 'id' })
                .createIndex('playerId', 'playerId');
            db.createObjectStore('planetNames', { keyPath: ['planetId', 'date'] })
                .createIndex('planetId', 'planetId');
            db.createObjectStore('planetStates', { keyPath: ['planetId', 'date'] })
                .createIndex('planetId', 'planetId');
            db.createObjectStore('planetCoordinates', { keyPath: ['planetId', 'date'] })
                .createIndex('planetId', 'planetId');

            db.createObjectStore('moons', { keyPath: 'id' })
                .createIndex('planetId', 'planetId');
            db.createObjectStore('moonNames', { keyPath: ['moonId', 'date'] })
                .createIndex('moonId', 'moonId');
            db.createObjectStore('moonStates', { keyPath: ['moonId', 'date'] })
                .createIndex('moonId', 'moonId');
        }
    });
}

export const globalDatabaseName = 'ogame-tracker';

export async function getGlobalDatabase(): Promise<IDBPDatabase<OgameTrackerGlobalDbSchema>> {
    return await getDatabase(globalDatabaseName, (db, oldVersion, newVersion, tx) => {
        if (oldVersion < 1) {
            db.createObjectStore('settings');
            db.createObjectStore('accounts', { keyPath: ['serverId', 'serverLanguage', 'id'] });
            db.createObjectStore('servers', { keyPath: ['id', 'language'] });
        }
        if (oldVersion < 2) {
            tx.objectStore('accounts').createIndex('server', ['serverId', 'serverLanguage']);
        }
    });
}