import { ExpeditionEvent } from "../../shared/models/v1/expeditions/ExpeditionEvents";
import { _logDebug } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { Lock } from 'semaphore-async-await';

const unloadTimeout = 5 * 60 * 1000; // 5 minutes

export class ExpeditionManager {
    private readonly _key: string;
    private _expeditions: Record<number, ExpeditionEvent> | null = null;
    private _unloadTimeout: number | undefined;
    private readonly _lock = new Lock();

    constructor(key: string) {
        this._key = key;
    }

    private get storageKey(): string {
        return `${this._key}-expoEvents`;
    }

    private registerUnload() {
        if (this._unloadTimeout != null) {
            clearTimeout(this._unloadTimeout);
        }
        this._unloadTimeout = setTimeout(async () => await this.unload(), unloadTimeout, []);
    }

    private async unload(): Promise<void> {
        await this.save();

        this._expeditions = null;
        this._unloadTimeout = undefined;
    }

    private async load(releaseLock: boolean): Promise<Record<number, ExpeditionEvent>> {
        await this._lock.acquire();

        if (this._expeditions == null) {
            _logDebug('loading expeditions from storage', this.storageKey);
            const data = await chrome.storage.local.get(this.storageKey);
            this._expeditions = data?.[this.storageKey] ?? {};
        }

        if(releaseLock) {
            this._lock.release();
        }

        this.registerUnload();

        return this._expeditions ?? _throw(`loaded expeditions but object is still null (key '${this._key}')`)
    }

    public async getExpeditions(): Promise<Record<number, ExpeditionEvent>> {
        return await this.load(true);
    }

    public async add(expeditionEvent: ExpeditionEvent): Promise<void> {
        const expeditions = await this.load(false);
        expeditions[expeditionEvent.id] = expeditionEvent;

        this._lock.release();
        
        await this.save();
    }

    private async save(): Promise<void> {
        await chrome.storage.local.set({
            [this.storageKey]: this._expeditions,
        });
    }
}