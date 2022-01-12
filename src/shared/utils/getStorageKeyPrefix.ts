import { MessageOgameMeta } from "../messages/Message";

export function getStorageKeyPrefix(meta: MessageOgameMeta): string {
    const { serverId, language, playerId } = meta;
    return `s${serverId}-${language}-${playerId}`;
}