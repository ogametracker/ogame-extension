import { sendMessage } from "@/shared/communication/sendMessage";
import { MessageType } from "@/shared/messages/MessageType";
import { UpdatePlayerNameMessage, UpdateUniverseNameMessage } from "@/shared/messages/tracking/empire";
import { getOgameMeta } from "@/shared/ogame-web/getOgameMeta";
import { _throw } from "@/shared/utils/_throw";
import { universeAccountTrackingUuid } from "@/shared/uuid";

const observer = new MutationObserver(() => {
    const body = document.querySelector('body');
    if(body != null) {
        observer.disconnect();

        trackUniverseName();
        trackAccount();
    }
});
observer.observe(document.documentElement, { childList: true, subtree: true });

function trackUniverseName() {
    const universeName = (document.querySelector('meta[name="ogame-universe-name"]') as HTMLMetaElement | null)?.content
        ?? _throw('no universe name meta found');

    const message: UpdateUniverseNameMessage = {
        type: MessageType.UpdateUniverseName,
        ogameMeta: getOgameMeta(),
        data: universeName,
        senderUuid: universeAccountTrackingUuid,
    };
    sendMessage(message);
}

function trackAccount() {
    const playerName = (document.querySelector('meta[name="ogame-player-name"]') as HTMLMetaElement | null)?.content 
        ?? _throw('no player name meta found');

    const message: UpdatePlayerNameMessage = {
        type: MessageType.UpdatePlayerName,
        ogameMeta: getOgameMeta(),
        data: playerName,
        senderUuid: universeAccountTrackingUuid,
    };
    sendMessage(message);
}

