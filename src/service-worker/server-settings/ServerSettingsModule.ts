import { MessageOgameMeta } from "../../shared/messages/Message";
import { ServerSettingsManager } from "./ServerSettingsManager";
import { getStorageKeyPrefix } from "../../shared/utils/getStorageKeyPrefix";
import { ServerSettings } from "@/shared/models/server-settings/ServerSettings";

export class ServerSettingsModule {
    private readonly managers: Record<string, ServerSettingsManager | undefined> = {};
    private readonly listeners: ((meta: MessageOgameMeta) => void)[] = [];

    private getManager(meta: MessageOgameMeta): ServerSettingsManager {
        const key = getStorageKeyPrefix(meta, false);

        let manager = this.managers[key];
        if(manager == null) {
            manager = new ServerSettingsManager(key, meta);
            manager.addBroadcastNotifyListener(() => this.listeners.forEach(listener => listener(meta)));
            this.managers[key] = manager;
        }

        return manager;
    }

    public addBroadcastNotifyListener(listener: (meta: MessageOgameMeta) => void) {
        this.listeners.push(listener);
    }

    public wake(meta: MessageOgameMeta) {
        this.getManager(meta);
    }

    public async getServerSettings(meta: MessageOgameMeta): Promise<ServerSettings> {
        const manager = this.getManager(meta);
        return await manager.getData();
    }
}