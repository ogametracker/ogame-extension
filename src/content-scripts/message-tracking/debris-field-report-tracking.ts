import { Message } from "../../shared/messages/Message";
import { MessageType } from "../../shared/messages/MessageType";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { _logDebug, _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { getMessageAttributes } from "../../shared/utils/getMessageAttributes";
import { addOrSetCustomMessageContent, cssClasses, formatNumber, tabIds } from "./utils";
import { MessageTrackingErrorMessage } from '../../shared/messages/tracking/misc';
import { DebrisFieldReportMessage, TrackDebrisFieldReportMessage } from '../../shared/messages/tracking/debris-fields';
import { ogameMetasEqual } from "../../shared/ogame-web/ogameMetasEqual";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { sendMessage } from "@/shared/communication/sendMessage";
import { messageTrackingUuid } from "@/shared/uuid";
import { v4 } from "uuid";
import { DebrisFieldReportTrackingNotificationMessage, DebrisFieldReportTrackingNotificationMessageData, MessageTrackingErrorNotificationMessage, NotificationType } from "@/shared/messages/notifications";
import { ResourceTypes } from "@/shared/models/ogame/resources/ResourceType";
import { settingsWrapper } from "./main";
 
let tabContent: Element | null = null;

const notificationIds = {
    result: v4(),
    error: v4(),
};
const waitingForReports: Record<number, true> = {};
const failedToTrackReport: Record<number, true> = {};
const totalDebrisFieldResult: DebrisFieldReportTrackingNotificationMessageData = {
    count: 0,
    resources: {
        metal: 0,
        crystal: 0,
        deuterium: 0,
    },
};
 
export function initDebrisFieldReportTracking() {
    chrome.runtime.onMessage.addListener(message => onMessage(message));

    const contentElem = document.querySelector('#pageContent .content') ?? _throw('Cannot find content element');
    const initObserver = new MutationObserver(() => {
        if (tabContent?.isConnected != true) {
            setupObserver();
        }
    });
    initObserver.observe(contentElem, { subtree: true, childList: true });
}

function setupObserver() {
    tabContent = document.querySelector(`.messagesHolder`);
    const tabContentElement = tabContent ?? _throw('Cannot find messages holder element');

    const observer = new MutationObserver(() => trackDebrisFieldReports(tabContentElement));
    observer.observe(tabContentElement, { childList: true, subtree: true });
}

function onMessage(message: Message<MessageType, any>) {
    const ogameMeta = getOgameMeta();
    if (!ogameMetasEqual(ogameMeta, message.ogameMeta)) {
        return;
    }

    switch (message.type) {
        case MessageType.DebrisFieldReport:
        case MessageType.NewDebrisFieldReport: {
            const msg = message as DebrisFieldReportMessage;

            const div = document.querySelector(`div.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find debris field report with id '${msg.data.id}'`);
            div.classList.add(cssClasses.messages.debrisFieldReport);

            div.classList.remove(cssClasses.messages.waitingToBeProcessed);
            div.classList.add(cssClasses.messages.processed);
            if (settingsWrapper.settings.messageTracking.showSimplifiedResults) {
                div.classList.add(cssClasses.messages.hideContent);
            }
            addOrSetCustomMessageContent(div, `
                <div 
                    class="ogame-tracker-debris-field-report" 
                    style="--columns: ${msg.data.deuterium != null ? 3 : 2}"
                >
                    <div class="ogame-tracker-resource metal"></div>
                    <div class="ogame-tracker-resource crystal"></div>
                    ${msg.data.deuterium != null ? '<div class="ogame-tracker-resource deuterium"></div>' : ''}
                    <div class="${msg.data.metal == 0 ? 'no-resources' : ''}">
                        ${formatNumber(msg.data.metal)}
                    </div>
                    <div class="${msg.data.crystal == 0 ? 'no-resources' : ''}">
                        ${formatNumber(msg.data.crystal)}
                    </div>
                    ${msg.data.deuterium != null
                    ? ` <div class="${msg.data.deuterium == 0 ? 'no-resources' : ''}">
                            ${formatNumber(msg.data.deuterium)}
                        </div>`
                    : ''}
                </div>
            `);

            delete waitingForReports[msg.data.id];
            if (message.type == MessageType.NewDebrisFieldReport) {
                updateReportResults(msg);
            }
            break;
        }

        case MessageType.TrackingError: {
            const { type, id } = (message as MessageTrackingErrorMessage).data;
            if (type != 'debris-field-report') {
                break;
            }

            const div = document.querySelector(`div.msg[data-msg-id="${id}"]`) ?? _throw(`failed to find combat report message with id '${id}'`);

            div.classList.remove(cssClasses.messages.waitingToBeProcessed);
            div.classList.add(cssClasses.messages.error);
            addOrSetCustomMessageContent(div, false);

            delete waitingForReports[id];
            failedToTrackReport[id] = true;
            sendNotificationMessages();
            break;
        }
    }
}

function trackDebrisFieldReports(elem: Element) {
    const tabLabel = document.querySelector(`.tabsWrapper .innerTabItem.active[data-subtab-id="${tabIds.misc}"]`);
    if (tabLabel == null) {
        return;
    }

    const messages = Array.from(elem.querySelectorAll('div.msg[data-msg-id]'))
        .filter(elem => {
            const messageType = elem.querySelector('.rawMessageData')?.getAttribute('data-raw-messagetype');
            return !elem.classList.contains(cssClasses.messages.base) && messageType === "32"; // @WONKY maybe created a typed version for messageTypes 
        });

    messages.forEach(msg => {
        const id = parseIntSafe(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id'), 10);

        try {
            // prepare message to service worker
            const element = msg.querySelector('.rawMessageData') ?? _throw(`Cannot find rawMessageData element`);
            const attributes = getMessageAttributes(element); 

            const timestamp = attributes["timestamp"] ?? _throw('Cannot find message timestamp');
            const coords = attributes["coords"] ?? _throw('Cannot find message coordinates');
            const recycledResourcesString = attributes['recycledresources'] ?? _throw('Cannot find message recycledresources');
            const recycledResources = JSON.parse(recycledResourcesString)

            const date = parseInt(timestamp, 10) * 1000;
            if (isNaN(date)) {
                _throw('Message timestamp is NaN');
            }
            
            // send message to service worker
            const workerMessage: TrackDebrisFieldReportMessage = {
                type: MessageType.TrackDebrisFieldReport,
                ogameMeta: getOgameMeta(),
                data: {
                    id,
                    date,
                    coords,
                    resources: {
                        metal: recycledResources.metal ?? 0,
                        crystal: recycledResources.crystal ?? 0,
                        deuterium: recycledResources.deuterium ?? null
                    }
                },
                senderUuid: messageTrackingUuid,
            };
            sendMessage(workerMessage);

            // mark message as "waiting for result"
            msg.classList.add(
                cssClasses.messages.base,
                cssClasses.messages.waitingToBeProcessed,
            );
            addOrSetCustomMessageContent(msg, `<div class="ogame-tracker-loader"></div>`);

            waitingForReports[id] = true;
        } catch (error) {
            _logError(error);

            msg.classList.add(cssClasses.messages.base, cssClasses.messages.error);
            addOrSetCustomMessageContent(msg, false);

            delete waitingForReports[id];
            failedToTrackReport[id] = true;
            sendNotificationMessages();
        }
    });
}

function sendNotificationMessages() {
    const failed = Object.keys(failedToTrackReport).length;
    if (failed > 0) {
        sendErrorNotificationMessage(failed);
    }

    if (totalDebrisFieldResult.count == 0) {
        return;
    }

    const msg: DebrisFieldReportTrackingNotificationMessage = {
        type: MessageType.Notification,
        ogameMeta: getOgameMeta(),
        senderUuid: messageTrackingUuid,
        data: {
            type: NotificationType.DebrisFieldReportTracking,
            messageId: notificationIds.result,
            ...totalDebrisFieldResult,
        },
    };
    sendMessage(msg);
}

function sendErrorNotificationMessage(failed: number) {
    const msg: MessageTrackingErrorNotificationMessage = {
        type: MessageType.Notification,
        ogameMeta: getOgameMeta(),
        senderUuid: messageTrackingUuid,
        data: {
            type: NotificationType.MessageTrackingError,
            messageId: notificationIds.error,
            count: failed,
        },
    };
    sendMessage(msg);
}

function updateReportResults(msg: DebrisFieldReportMessage) {
    delete waitingForReports[msg.data.id];
    totalDebrisFieldResult.count++;

    ResourceTypes.forEach(resource => totalDebrisFieldResult.resources[resource] += msg.data[resource] ?? 0);

    sendNotificationMessages();
}
