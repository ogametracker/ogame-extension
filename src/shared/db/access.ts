import { IDBPDatabase, IDBPTransaction, openDB, StoreNames, unwrap } from "idb";
import Semaphore from "semaphore-async-await";
import { MessageOgameMeta } from "../messages/Message";
import { DbVersion, OgameTrackerGlobalDbSchema, OgameTrackerPlayerDbSchema, OgameTrackerServerDbSchema } from "./schema";

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
    return await getDatabase(name, (db) => {
        db.createObjectStore('combatReports', { keyPath: 'id' });
        db.createObjectStore('debrisFieldReports', { keyPath: 'id' });
        db.createObjectStore('expeditions', { keyPath: 'id' });
        db.createObjectStore('empire');
    });
}

export async function getServerDatabase(meta: MessageOgameMeta): Promise<IDBPDatabase<OgameTrackerServerDbSchema>> {
    const name = `s${meta.serverId}-${meta.language}`;
    return await getDatabase(name, (db) => {
        db.createObjectStore('serverSettings');

        //TODO: implement db upgrade for universe history
    });
}

export async function getGlobalDatabase(): Promise<IDBPDatabase<OgameTrackerGlobalDbSchema>> {
    return await getDatabase('ogame-tracker', (db) => {
        db.createObjectStore('settings');
        db.createObjectStore('accounts', { keyPath: ['serverId', 'serverLanguage', 'id'] });
        db.createObjectStore('servers', { keyPath: ['id', 'language'] });
    });
}