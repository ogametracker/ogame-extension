import { DbVersion, OgameTrackerDbSchema } from "@/shared/db/OgameTrackerDbSchema";
import { getStorageKeyPrefix } from "@/shared/utils/getStorageKeyPrefix";
import { IDBPDatabase, openDB } from "idb";
import { Lock } from "semaphore-async-await";
import { GlobalOgameMetaData } from "./GlobalOgameMetaData";

let db: IDBPDatabase<OgameTrackerDbSchema> | null = null;
const lock = new Lock();

export async function getDatabase() {
    await lock.acquire();
    
    if (db == null) {
        const name = getStorageKeyPrefix(GlobalOgameMetaData);
        db = await openDB(name, DbVersion);
    }

    lock.release();
    return db;
}