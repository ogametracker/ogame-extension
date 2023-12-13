import { MessageOgameMeta } from "../messages/Message";
import { parseIntSafe } from "../utils/parseNumbers";
import { _throw } from "../utils/_throw";

function getCookies(): Record<string, string> {
    const cookies: Record<string, string> = {};

    document.cookie.split(';')
        .forEach(cookie => {
            const [key, value] = cookie.split('=').map(x => decodeURIComponent(x.trim()));
            cookies[key] = value;
        });

    return cookies;
}

function getLanguageMeta(): string {
    return (document.querySelector('meta[name="ogame-language"]') as HTMLMetaElement | null)?.content ?? _throw('Cannot find language meta tag');
}

function getUserLanguage(): string {
    const userLanguage = getCookies()['oglocale'];
    
    if(userLanguage == null || userLanguage == 'undefined') { // yes, it's actually a string with 'undefined' for whatever reason
        return getLanguageMeta();
    }

    return userLanguage;
}

export function getOgameMeta(): MessageOgameMeta {
    const userLanguage = getUserLanguage;

    const serverText = (document.querySelector('meta[name="ogame-universe"]') as HTMLMetaElement | null)?.content ?? _throw('Cannot find universe meta tag');
    const [serverIdText, language] = serverText.split('.')[0].split('-').map(x => x.replace(/^s/, ''));
    if (!/^\d+$/.test(serverIdText)) {
        _throw('Found ogame universe tag but failed to extract server id from it');
    }
    const serverId = parseIntSafe(serverIdText, 10);

    const playerIdText = (document.querySelector('meta[name="ogame-player-id"]') as HTMLMetaElement | null)?.content ?? _throw('Cannot find player id meta tag');
    const playerId = parseIntSafe(playerIdText, 10);

    return {
        language,
        userLanguage,
        serverId,
        playerId,
    };
}