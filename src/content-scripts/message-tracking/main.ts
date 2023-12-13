import { getQueryParameters } from "../../shared/utils/getQueryParameters";
import { initExpeditionAndLifeformDiscoveryTracking } from "./expedition-and-lifeform-discovery-tracking";
import { initDebrisFieldReportTracking } from "./debris-field-report-tracking";
import { initCombatReportTracking } from "./combat-report-tracking";
import { Settings } from "@/shared/models/settings/Settings";
import { RequestSettingsMessage, SettingsMessage } from "@/shared/messages/settings";
import { MessageType } from "@/shared/messages/MessageType";
import { messageTrackingUuid } from "@/shared/uuid";
import { sendMessage } from "@/shared/communication/sendMessage";
import { Message } from "@/shared/messages/Message";

import './styles.scss';
import { getOgameMeta } from "@/shared/ogame-web/getOgameMeta";

const queryParams = getQueryParameters(location.search);
export const settingsWrapper = {
    settings: {} as Settings,
};
if (queryParams.page == 'messages') {
    init();
}

async function init() {
    const settingsPromise = getSettings();

    initExpeditionAndLifeformDiscoveryTracking();
    initCombatReportTracking();
    initDebrisFieldReportTracking();

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