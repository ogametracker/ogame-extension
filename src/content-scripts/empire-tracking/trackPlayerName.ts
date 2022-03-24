import { sendMessage } from "@/shared/communication/sendMessage";
import { MessageType } from "../../shared/messages/MessageType";
import { UpdatePlayerNameMessage } from "../../shared/messages/tracking/empire";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackPlayerName() {
    observerCallbacks.push({
        selector: '#siteFooter',
        callback: () => {
            const playerName = (document.querySelector('meta[name="ogame-player-name"]') as HTMLMetaElement | null)?.content 
                ?? _throw('no player name meta found');

            const message: UpdatePlayerNameMessage = {
                type: MessageType.UpdatePlayerName,
                ogameMeta: getOgameMeta(),
                data: playerName,
            };
            sendMessage(message);
        },
    });
}