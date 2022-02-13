import { MessageOgameMeta } from "../messages/Message";
import { parseIntSafe } from "../utils/parseNumbers";
import { _throw } from "../utils/_throw";

export function getOgameMeta(): MessageOgameMeta {
    const language = (document.querySelector('meta[name="ogame-language"]') as HTMLMetaElement | null)?.content ?? _throw('Cannot find language meta tag');

    const serverText = (document.querySelector('meta[name="ogame-universe"]') as HTMLMetaElement | null)?.content ?? _throw('Cannot find universe meta tag');
    const serverIdText = serverText.split('-')[0].replace(/^s/, '');
    if (!/^\d+$/.test(serverIdText)) {
        _throw('Found ogaame universe tag but failed to extract server id from it');
    }
    const serverId = parseIntSafe(serverIdText, 10);

    const playerIdText = (document.querySelector('meta[name="ogame-player-id"]') as HTMLMetaElement | null)?.content ?? _throw('Cannot find player id meta tag');
    const playerId = parseIntSafe(playerIdText, 10);

    return {
        language,
        serverId,
        playerId,
    };
}