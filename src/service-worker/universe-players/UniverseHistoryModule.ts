import { MessageOgameMeta } from "../../shared/messages/Message";
import { UniverseHistoryManager } from "./UniverseHistoryManager";
import { getStorageKeyPrefix } from "../../shared/utils/getStorageKeyPrefix";

export class UniverseHistoryModule {
    private readonly managers: Record<string, UniverseHistoryManager | undefined> = {};

    // public async updateSettings(message: UpdateSettingsMessage): Promise<void> {
    //     const manager = this.getManager(message.ogameMeta);
    //     manager.updateData(message.data);
    // }

    // public async getSettings(meta: MessageOgameMeta): Promise<Settings> {
    //     const manager = this.getManager(meta);
    //     return await manager.getData();
    // }

    private getManager(meta: MessageOgameMeta): UniverseHistoryManager {
        const key = getStorageKeyPrefix(meta, false);
        const manager = (this.managers[key] ??= new UniverseHistoryManager(key, meta));

        return manager;
    }

    public wake(meta: MessageOgameMeta) {
        this.getManager(meta);
    }
}