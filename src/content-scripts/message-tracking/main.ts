import { getQueryParameters } from "@ogame-tracker/shared/utils/getQueryParameters";
import { Settings } from "@ogame-tracker/shared/models/settings/Settings";
import { RequestSettingsMessage, SettingsMessage } from "@ogame-tracker/shared/messages/settings";
import { MessageType } from "@ogame-tracker/shared/messages/MessageType";
import { messageTrackingUuid } from "@ogame-tracker/shared/uuid";
import { sendMessage } from "@ogame-tracker/shared/communication/sendMessage";
import { Message } from "@ogame-tracker/shared/messages/Message";
import { getOgameMeta } from "@ogame-tracker/shared/ogame-web/getOgameMeta";
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