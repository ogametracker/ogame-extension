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

    protected async load(releaseLock: boolean): Promise<TItem> {
        await this._readLock.acquire();

        if (this._item == null) {
            _logDebug('loading item from storage', this.storageKey);
            const data = await chrome.storage.local.get(this.storageKey);
            this._item = data?.[this.storageKey] ?? {};
        }

        if(releaseLock) {
            this._readLock.release();
        }

        this.registerUnload();

        return this._item ?? _throw(`loaded items but object is still null (key '${this._key}')`)
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

export abstract class PersistentCollectionDataManager<TItem extends PersistentDataItem> extends PersistentDataManager<Record<number, TItem>> {
    constructor(key: string, suffix: string) {
        super(key, suffix);
    }

    public async add(item: TItem): Promise<void> {
        const items = await this.load(false);
        items[item.id] = item;

        this._readLock.release();
        
        await this.save();
    }
}