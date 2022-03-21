import { MessageOgameMeta } from "../../shared/messages/Message";
import { UniverseHistoryManager } from "./UniverseHistoryManager";
import { getStorageKeyPrefix } from "../../shared/utils/getStorageKeyPrefix";
import { UniverseHistory } from "../../shared/models/universe-history/UniverseHistory";

export class UniverseHistoryModule {
    private readonly managers: Record<string, UniverseHistoryManager | undefined> = {};
    private readonly listeners: ((meta: MessageOgameMeta) => void)[] = [];

    private getManager(meta: MessageOgameMeta): UniverseHistoryManager {
        const key = getStorageKeyPrefix(meta, false);

        let manager = this.managers[key];
        if(manager == null) {
            manager = new UniverseHistoryManager(key, meta);
            manager.addBroadcastNotifyListener(() => this.listeners.forEach(listener => listener(meta)))
        }

        return manager;
    }

    public addBroadcastNotifyListener(listener: (meta: MessageOgameMeta) => void) {
        this.listeners.push(listener);
    }

    public wake(meta: MessageOgameMeta) {
        this.getManager(meta);
    }

    public async getHistory(meta: MessageOgameMeta): Promise<UniverseHistory> {
        const manager = this.getManager(meta);
        return await manager.getData();
    }
}