import { ogameTrackerNotificationWindowResizeEventName } from "@/shared/messages/communication";
import { _throw } from "@/shared/utils/_throw";

import './styles.scss';
import { getOgameMeta } from "@/shared/ogame-web/getOgameMeta";

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
    var meta = getOgameMeta();

    const queryData: Record<string, string> = {
        player: meta.playerId.toString(),
        language: meta.language,
        server: meta.serverId.toString(),
    };

    const query = new URLSearchParams(queryData);
    return `${url}?${query}`;
}