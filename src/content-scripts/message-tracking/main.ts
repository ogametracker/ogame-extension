import { getQueryParameters } from "../../shared/utils/getQueryParameters";
import { Settings } from "@/shared/models/settings/Settings";
import { RequestSettingsMessage, SettingsMessage } from "@/shared/messages/settings";
import { MessageType } from "@/shared/messages/MessageType";
import { messageTrackingUuid } from "@/shared/uuid";
import { sendMessage } from "@/shared/communication/sendMessage";
import { Message } from "@/shared/messages/Message";
import { getOgameMeta } from "@/shared/ogame-web/getOgameMeta";
import { initMessageTracking } from "./base-message-tracking";

import './styles.scss';

const queryParams = getQueryParameters(location.search);
export const settingsWrapper = {
    settings: {} as Settings,
};
if (queryParams.page?.toLowerCase() == 'ingame' && queryParams.component?.toLowerCase() == 'messages') {
    init();
}

async function init() {
    const settingsPromise = getSettings();

    initMessageTracking();

    settingsWrapper.settings = await settingsPromise;
}

function getSettings(): Promise<Settings> {
    return new Promise<Settings>(resolve => {
        chrome.runtime.onMessage.addListener(msg => {
            const message = msg as Message;
            if(message.type != MessageType.Settings) {
                return;
            }

            const settingsMsg = message as SettingsMessage;
            resolve(settingsMsg.data);
        });

        const requestMessage: RequestSettingsMessage = {
            type: MessageType.RequestSettings,
            ogameMeta: getOgameMeta(),
            senderUuid: messageTrackingUuid,
        };
        sendMessage(requestMessage);
    });
}