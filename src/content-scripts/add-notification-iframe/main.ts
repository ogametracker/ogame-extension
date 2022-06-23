import { ogameTrackerNotificationWindowResizeEventName } from "@/shared/messages/communication";
import { _throw } from "@/shared/utils/_throw";

import './styles.scss';

const iframe = document.createElement('iframe');
iframe.id = 'ogame-tracker-notifications__v2';
iframe.src = getPageUrl();

document.body.append(iframe);

window.addEventListener('message', e => {
    if(e.data?.type == ogameTrackerNotificationWindowResizeEventName) {
        iframe.style.setProperty('--width', e.data.width);
        iframe.style.setProperty('--height', e.data.height);
    }
});



function getPageUrl() {
    const url = chrome.runtime.getURL('/views/notifications.html');
    const player = (document.querySelector('meta[name="ogame-player-id"]') as HTMLMetaElement | null)?.content
        ?? _throw('cannot find meta tag with player id');
    const language = (document.querySelector('meta[name="ogame-language"]') as HTMLMetaElement | null)?.content
        ?? _throw('cannot find meta tag with universe language');
    const server = (document.querySelector('meta[name="ogame-universe"]') as HTMLMetaElement | null)
        ?.content?.split('-')?.[0]?.substring(1)
        ?? _throw('cannot find meta tag with universe language');

    const queryData: Record<string, string> = {
        player,
        language,
        server,
    };

    const query = new URLSearchParams(queryData);
    return `${url}?${query}`;
}