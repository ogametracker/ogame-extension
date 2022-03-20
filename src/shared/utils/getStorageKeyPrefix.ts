import { MessageOgameMeta } from "../messages/Message";

export function getStorageKeyPrefix(meta: MessageOgameMeta, includePlayerId = true): string {
    const { serverId, language, playerId } = meta;
    const serverPrefix = `s${serverId}-${language}`;
    if (!includePlayerId) {
        return serverPrefix;
    }
    return `${serverPrefix}-${playerId}`;
}