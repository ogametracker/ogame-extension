import { MessageOgameMeta } from "../messages/Message";

export function ogameMetasEqual(a: MessageOgameMeta, b: MessageOgameMeta): boolean {
    return a.language == b.language
        && a.playerId == b.playerId
        && a.serverId == b.serverId;
}