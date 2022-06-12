import { IDBPDatabase, IDBPTransaction, openDB, StoreNames, unwrap } from "idb";
import Semaphore from "semaphore-async-await";
import { MessageOgameMeta } from "../messages/Message";
import { DbVersion, OgameTrackerGlobalDbSchema, OgameTrackerPlayerDbSchema, OgameTrackerServerDbSchema } from "./schema";

const databases: Partial<Record<string, IDBPDatabase<any>>> = {};
const dbLocks: Partial<Record<string, Semaphore>> = {};

async function getDatabase<TSchema>(
    name: string,
    upgrade: (db: IDBPDatabase<TSchema>, oldVersion: number, newVersion: number | null, transaction: IDBPTransaction<TSchema, StoreNames<TSchema>[], "versionchange">) => void
): Promise<IDBPDatabase<TSchema>> {
    let lock = dbLocks[name];
    if (lock == null) {
        lock = new Semaphore(1000);
        lock.drainPermits();
    }
    else {
        await lock.acquire();
    }

    let db = databases[name];
    if (db == null) {
        db = await openDB<TSchema>(name, DbVersion, { upgrade });
        db.addEventListener('close', ev => delete databases[name]);
        databases[name] = db;
    }

    lock.release();
    return db;
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
    return await getDatabase(name, () => {
        //TODO: implement db upgrade
        throw new Error('not implemented');
    });
}

export async function getGlobalDatabase(): Promise<IDBPDatabase<OgameTrackerGlobalDbSchema>> {
    return await getDatabase('ogame-tracker', (db) => {
        db.createObjectStore('settings');
        db.createObjectStore('accounts', { keyPath: ['serverId', 'serverLanguage', 'id'] });
        db.createObjectStore('servers', { keyPath: ['id', 'language'] });
    });
}