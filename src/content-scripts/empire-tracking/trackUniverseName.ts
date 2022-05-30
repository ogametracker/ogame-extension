import { sendMessage } from "@/shared/communication/sendMessage";
import { empireTrackingUuid } from "@/shared/uuid";
import { MessageType } from "../../shared/messages/MessageType";
import { UpdateUniverseNameMessage } from "../../shared/messages/tracking/empire";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackUniverseName() {
    observerCallbacks.push({
        selector: '#siteFooter',
        callback: () => {
            const universeName = (document.querySelector('meta[name="ogame-universe-name"]') as HTMLMetaElement | null)?.content
                ?? _throw('no universe name meta found');

            const message: UpdateUniverseNameMessage = {
                type: MessageType.UpdateUniverseName,
                ogameMeta: getOgameMeta(),
                data: universeName,
                senderUuid: empireTrackingUuid,
            };
            sendMessage(message);
        },
    });
}