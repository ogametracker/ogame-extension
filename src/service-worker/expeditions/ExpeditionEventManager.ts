import { ExpeditionEvent } from "../../shared/models/v1/expeditions/ExpeditionEvents";
import { _throw } from "../../shared/utils/_throw";

export class ExpeditionEventManager {
    private readonly _key: string;
    private _expeditions: Record<number, ExpeditionEvent> | null = null;
    private _unloadTimeout: number | undefined;

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
        this._unloadTimeout = setTimeout(async () => await this.unload(), 0, []);
    }

    private async unload(): Promise<void> {
        await this.save();

        this._expeditions = null;
        this._unloadTimeout = undefined;
    }

    private async load(): Promise<Record<number, ExpeditionEvent>> {
        if (this._expeditions == null) {
            const data = await chrome.storage.local.get(this.storageKey);
            this._expeditions = data?.[this.storageKey] ?? {};
        }

        this.registerUnload();

        return this._expeditions ?? _throw(`loaded expeditions but object is still null (key '${this._key}')`)
    }

    public async getExpeditions(): Promise<Record<number, ExpeditionEvent>> {
        return await this.load();
    }

    public async add(expeditionEvent: ExpeditionEvent): Promise<void> {
        const expeditions = await this.load();
        expeditions[expeditionEvent.id] = expeditionEvent;
        
        await this.save();
    }

    private async save(): Promise<void> {
        await chrome.storage.local.set({
            [this.storageKey]: this._expeditions,
        });
    }
}