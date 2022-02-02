// Chrome currently shuts down the background service worker about every 5 minutes.
// Thus this script sends a message every 60 seconds to keep the service worker alive as long as an OGame page is open.

import { StayAliveMessage } from '@/shared/messages/internal/StayAliveMessage';
import { MessageType } from '@/shared/messages/MessageType';
import { getOgameMeta } from '@/shared/ogame-web/getOgameMeta';


setTimeout(() => renew(), 0);

function renew() {
    const message: StayAliveMessage = { 
        type: MessageType.StayAlive,
        ogameMeta: getOgameMeta(),
     };
    chrome.runtime.sendMessage(message);

    setTimeout(() => renew(), 60 * 1000);
}