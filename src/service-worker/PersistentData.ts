import { Lock } from "semaphore-async-await";
import { _logDebug } from "../shared/utils/_log";
import { _throw } from "../shared/utils/_throw";

export interface PersistentDataItem {
    id: number;
}

const unloadTimeout = 5 * 60 * 1000; // 5 minutes
export abstract class PersistentDataManager<TItem extends PersistentDataItem> {
    private readonly _key: string;
    private readonly _suffix: string;
    private _items: Record<number, TItem> | null = null;
    private _unloadTimeout: number | undefined;
    private readonly _readLock = new Lock();
    private readonly _writeLock = new Lock();

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

        this._items = null;
        this._unloadTimeout = undefined;
    }

    private async load(releaseLock: boolean): Promise<Record<number, TItem>> {
        await this._readLock.acquire();

        if (this._items == null) {
            _logDebug('loading items from storage', this.storageKey);
            const data = await chrome.storage.local.get(this.storageKey);
            this._items = data?.[this.storageKey] ?? {};
        }

        if(releaseLock) {
            this._readLock.release();
        }

        this.registerUnload();

        return this._items ?? _throw(`loaded items but object is still null (key '${this._key}')`)
    }

    public async getItems(): Promise<Record<number, TItem>> {
        return await this.load(true);
    }

    public async add(item: TItem): Promise<void> {
        const items = await this.load(false);
        items[item.id] = item;

        this._readLock.release();
        
        await this.save();
    }

    private async save(): Promise<void> {
        await this._writeLock.acquire();

        await chrome.storage.local.set({
            [this.storageKey]: this._items,
        });

        this._writeLock.release();
    }
}