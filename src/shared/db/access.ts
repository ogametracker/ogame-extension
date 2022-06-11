import { IDBPDatabase, openDB } from "idb";
import Semaphore from "semaphore-async-await";
import { MessageOgameMeta } from "../messages/Message";
import { DbVersion, OgameTrackerGlobalDbSchema, OgameTrackerPlayerDbSchema, OgameTrackerServerDbSchema } from "./schema";

const databases: Partial<Record<string, IDBPDatabase<any>>> = {};
const dbLocks: Partial<Record<string, Semaphore>> = {};

async function getDatabase<TSchema>(name: string): Promise<IDBPDatabase<TSchema>> {
    let lock = dbLocks[name];
    if(lock == null) {
        lock = new Semaphore(1000);
        lock.drainPermits();
    } 
    else {
        await lock.acquire();
    }

    let db = databases[name];
    if (db == null) {
        db = await openDB(name, DbVersion, {
            upgrade() {
                throw new Error(`db '${name}' does not exist`);
            },
        });
        databases[name] = db;
    }

    lock.release();
    return db;
}

export async function getPlayerDatabase(meta: MessageOgameMeta): Promise<IDBPDatabase<OgameTrackerPlayerDbSchema>> {
    const name = `s${meta.serverId}-${meta.language}-${meta.playerId}`;
    return await getDatabase(name);
}

export async function getServerDatabase(meta: MessageOgameMeta): Promise<IDBPDatabase<OgameTrackerServerDbSchema>> {
    const name = `s${meta.serverId}-${meta.language}`;
    return await getDatabase(name);
}

export async function getGlobalDatabase(): Promise<IDBPDatabase<OgameTrackerGlobalDbSchema>> {
    return await getDatabase('ogame-tracker');
}