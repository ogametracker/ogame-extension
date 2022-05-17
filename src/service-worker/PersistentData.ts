import { DbVersion, OgameTrackerDbSchema } from "@/shared/db/OgameTrackerDbSchema";
import { IDBPDatabase, openDB } from "idb";
import { Lock } from "semaphore-async-await";
import { _logDebug } from "../shared/utils/_log";
import { _throw } from "../shared/utils/_throw";

export interface PersistentDataItem {
    id: number;
}

const unloadTimeout = 15 * 60 * 1000; // 15 minutes
export abstract class PersistentDataManager<TItem> {
    private readonly _key: string;
    private readonly _suffix: string;
    private _item: TItem | null = null;
    private _unloadTimeout: number | undefined;
    protected readonly _readLock = new Lock();
    protected readonly _writeLock = new Lock();

    constructor(key: string, suffix: string) {
        this._key = key;
        this._suffix = suffix;
    }

    private get storageKey(): string {
        return `${this._key}-${this._suffix}`;
    }

    private registerUnload() {
        if (this._unloadTimeout != null) {
            clearTimeout(this._unloadTimeout);
        }
        this._unloadTimeout = setTimeout(async () => await this.unload(), unloadTimeout, []);
    }

    private async unload(): Promise<void> {
        await this.save();

        this._item = null;
        this._unloadTimeout = undefined;
    }

    protected abstract getDefaultItem(): TItem;

    protected async load(releaseLock: boolean): Promise<TItem> {
        await this._readLock.acquire();

        if (this._item == null) {
            _logDebug('loading item from storage', this.storageKey);
            const data = await chrome.storage.local.get(this.storageKey);
            this._item = data?.[this.storageKey] ?? this.getDefaultItem();
        }

        if (releaseLock) {
            this._readLock.release();
        }

        this.registerUnload();

        return this._item ?? _throw(`loaded items but object is still null (key '${this._key}')`)
    }

    public async updateInTransaction(action: (data: TItem) => TItem): Promise<void> {
        const data = await this.load(false);
        const updatedData = action(data);
        this._readLock.release();

        await this.updateData(updatedData);
    }

    public async updateData(data: TItem): Promise<void> {
        await this._readLock.acquire();
        this._item = data;
        this._readLock.release();

        await this.save();
    }

    public async getData(): Promise<TItem> {
        return await this.load(true);
    }

    protected async save(): Promise<void> {
        await this._writeLock.acquire();

        await chrome.storage.local.set({
            [this.storageKey]: this._item,
        });

        this._writeLock.release();
    }
}


const databases: Partial<Record<string, IDBPDatabase<OgameTrackerDbSchema>>> = {};
const dbLocks: Partial<Record<string, Lock>> = {};

export async function getDatabase(name: string): Promise<IDBPDatabase<OgameTrackerDbSchema>> {
    const lock = (dbLocks[name] ??= new Lock());
    await lock.acquire();

    let db = databases[name];
    if (db == null) {
        db = await openDB(name, DbVersion, {
            upgrade() {
                throw new Error('db does not exist');
            },
        });
        databases[name] = db;
    }

    lock.release();
    return db;
}