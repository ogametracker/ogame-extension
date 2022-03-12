import { MessageOgameMeta } from "../../shared/messages/Message";
import { SettingsManager } from "./SettingsManager";
import { getStorageKeyPrefix } from "../../shared/utils/getStorageKeyPrefix";
import { Settings } from "../../shared/models/v1/settings/Settings";
import { UpdateSettingsMessage } from "../../shared/messages/settings";

export class SettingsModule {
    private readonly managers: Record<string, SettingsManager | undefined> = {};

    public async updateSettings(message: UpdateSettingsMessage): Promise<void> {
        const manager = this.getManager(message.ogameMeta);
        manager.updateData(message.data);
    }

    public async getSettings(meta: MessageOgameMeta): Promise<Settings> {
        const manager = this.getManager(meta);
        return await manager.getData();
    }

    private getManager(meta: MessageOgameMeta): SettingsManager {
        const key = getStorageKeyPrefix(meta);
        const manager = (this.managers[key] ??= new SettingsManager(key));

        return manager;
    }
}