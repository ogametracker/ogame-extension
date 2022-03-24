import { MessageOgameMeta } from '../messages/Message';

export function ogameMetasEqual(a: MessageOgameMeta, b: MessageOgameMeta, includePlayerId = true): boolean {
    return a.language == b.language
        && a.serverId == b.serverId
        && (!includePlayerId || a.playerId == b.playerId);
}