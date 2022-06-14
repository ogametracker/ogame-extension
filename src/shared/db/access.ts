import { IDBPDatabase, IDBPTransaction, openDB, StoreNames, unwrap } from "idb";
import { MessageOgameMeta } from "../messages/Message";
import { DbVersion, OgameTrackerGlobalDbSchema, OgameTrackerPlayerDbSchema, OgameTrackerServerDbSchema, OgameTrackerUniverseHistoryDbSchema } from "./schema";

const databases: Partial<Record<string, Promise<IDBPDatabase<any>>>> = {};

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

export async function getPlayerDatabase(meta: MessageOgameMeta): Promise<IDBPDatabase<OgameTrackerPlayerDbSchema>> {
    const name = `s${meta.serverId}-${meta.language}-${meta.playerId}`;
    return await getDatabase(name, (db, oldVersion, newVersion, tx) => {
        if (newVersion == 1) {
            db.createObjectStore('combatReports', { keyPath: 'id' });
            db.createObjectStore('debrisFieldReports', { keyPath: 'id' });
            db.createObjectStore('expeditions', { keyPath: 'id' });
            db.createObjectStore('empire');
        }
        else {
            throw new Error('invalid db version');
        }
    });
}

export async function getServerDatabase(meta: MessageOgameMeta): Promise<IDBPDatabase<OgameTrackerServerDbSchema>> {
    const name = `s${meta.serverId}-${meta.language}`;
    return await getDatabase(name, (db, oldVersion, newVersion, tx) => {
        if (newVersion == 1) {
            db.createObjectStore('serverSettings');
        }
        else {
            throw new Error('invalid db version');
        }
    });
}

export async function getUniverseHistoryDatabase(meta: MessageOgameMeta): Promise<IDBPDatabase<OgameTrackerUniverseHistoryDbSchema>> {
    const name = `s${meta.serverId}-${meta.language}.universeHistory`;
    return await getDatabase(name, (db, oldVersion, newVersion, tx) => {
        if (newVersion == 1) {
            db.createObjectStore('_lastUpdate');

            db.createObjectStore('alliances', { keyPath: 'id' });
            db.createObjectStore('allianceTags', { keyPath: ['allianceId', 'date'] });
            db.createObjectStore('allianceNames', { keyPath: ['allianceId', 'date'] });
            db.createObjectStore('allianceMembers', { keyPath: ['allianceId', 'date'] });
            db.createObjectStore('allianceStates', { keyPath: ['allianceId', 'date'] });
            db.createObjectStore('allianceScores', { keyPath: ['allianceId', 'date', 'type'] });

            db.createObjectStore('players', { keyPath: 'id' });
            db.createObjectStore('playerNames', { keyPath: ['playerId', 'date'] });
            db.createObjectStore('playerStates', { keyPath: ['playerId', 'date'] });
            db.createObjectStore('playerAlliances', { keyPath: ['playerId', 'date'] });
            db.createObjectStore('playerScores', { keyPath: ['playerId', 'date', 'type'] });

            db.createObjectStore('planets', { keyPath: 'id' });
            db.createObjectStore('planetNames', { keyPath: ['planetId', 'date'] });
            db.createObjectStore('planetStates', { keyPath: ['planetId', 'date'] });
            db.createObjectStore('planetCoordinates', { keyPath: ['planetId', 'date'] });

            db.createObjectStore('moons', { keyPath: 'id' });
            db.createObjectStore('moonNames', { keyPath: ['moonId', 'date'] });
            db.createObjectStore('moonStates', { keyPath: ['moonId', 'date'] });
        }
        else {
            throw new Error('invalid db version');
        }
    });
}

export async function getGlobalDatabase(): Promise<IDBPDatabase<OgameTrackerGlobalDbSchema>> {
    return await getDatabase('ogame-tracker', (db, oldVersion, newVersion, tx) => {
        if (newVersion == 1) {
            db.createObjectStore('settings');
            db.createObjectStore('accounts', { keyPath: ['serverId', 'serverLanguage', 'id'] });
            db.createObjectStore('servers', { keyPath: ['id', 'language'] });
        }
        else {
            throw new Error('invalid db version');
        }
    });
}