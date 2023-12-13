import { parse } from "date-fns";
import { Message } from "../../shared/messages/Message";
import { MessageType } from "../../shared/messages/MessageType";
import { dateTimeFormat } from "../../shared/ogame-web/constants";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { _logDebug } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { addOrSetCustomMessageContent, cssClasses, formatNumber, tabIds } from "./utils";
import { MessageTrackingErrorMessage } from '../../shared/messages/tracking/misc';
import { DebrisFieldReportMessage, TrackDebrisFieldReportMessage } from '../../shared/messages/tracking/debris-fields';
import { ogameMetasEqual } from "../../shared/ogame-web/ogameMetasEqual";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { sendMessage } from "@/shared/communication/sendMessage";
import { messageTrackingUuid } from "@/shared/uuid";
import { v4 } from "uuid";
import { DebrisFieldReportTrackingNotificationMessage, DebrisFieldReportTrackingNotificationMessageData, MessageTrackingErrorNotificationMessage, NotificationType } from "@/shared/messages/notifications";
import { ResourceType, ResourceTypes } from "@/shared/models/ogame/resources/ResourceType";
import { settingsWrapper } from "./main";
import { LanguageKey } from "@/shared/i18n/LanguageKey";
import { getLanguage } from "@/shared/i18n/getLanguage";
import messageHeaders from "@/shared/i18n/ogame/messages/message-titles";

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

    const contentElem = document.querySelector('#content .content') ?? _throw('Cannot find content element');
    const initObserver = new MutationObserver(() => {
        if (tabContent?.isConnected != true) {
            setupObserver();
        }
    });
    initObserver.observe(contentElem, { subtree: true, childList: true });
}

function setupObserver() {
    const tabLabel = document.querySelector(`[id^="subtabs-"][data-tabid="${tabIds.misc}"]`) ?? _throw('Cannot find label of misc messages');
    const tabContentId = tabLabel.getAttribute('aria-controls') ?? _throw('Cannot find id of misc messages tab content');
    tabContent = document.querySelector(`#${tabContentId}`);
    const tabContentElem = tabContent ?? _throw('Cannot find content element of misc messages');

    const meta = getOgameMeta();
    const lang = getLanguage(meta.userLanguage);
    if (lang != null) {
        const observer = new MutationObserver(() => trackDebrisFieldReports(lang, tabContentElem));
        observer.observe(tabContentElem, { childList: true, subtree: true });
    }
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

            const li = document.querySelector(`li.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find debris field report with id '${msg.data.id}'`);
            li.classList.add(cssClasses.messages.debrisFieldReport);

            li.classList.remove(cssClasses.messages.waitingToBeProcessed);
            li.classList.add(cssClasses.messages.processed);
            if (settingsWrapper.settings.messageTracking.showSimplifiedResults) {
                li.classList.add(cssClasses.messages.hideContent);
            }
            addOrSetCustomMessageContent(li, `
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

            const li = document.querySelector(`li.msg[data-msg-id="${id}"]`) ?? _throw(`failed to find combat report message with id '${id}'`);

            li.classList.remove(cssClasses.messages.waitingToBeProcessed);
            li.classList.add(cssClasses.messages.error);
            addOrSetCustomMessageContent(li, false);

            delete waitingForReports[id];
            failedToTrackReport[id] = true;
            sendNotificationMessages();
            break;
        }
    }
}

function trackDebrisFieldReports(lang: LanguageKey, elem: Element) {
    const messages = Array.from(elem.querySelectorAll('li.msg[data-msg-id]'))
        .filter(elem => !elem.classList.contains(cssClasses.messages.base));
    const headers = messageHeaders[lang];

    messages.forEach(msg => {
        const id = parseIntSafe(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id'), 10);

        try {
            // prepare message to service worker
            const dateText = msg.querySelector('.msg_head .msg_date')?.textContent ?? _throw('Cannot find message date');
            const date = parse(dateText, dateTimeFormat, new Date()).getTime();
            if (isNaN(date)) {
                _throw('Message date is NaN');
            }

            const messageTextElem = msg.querySelector('.msg_content') ?? _throw('Cannot find message content element');
            const text = messageTextElem.textContent ?? '';
            const html = messageTextElem.innerHTML;

            const messageTitle = msg.querySelector('.msg_title')?.textContent ?? '';
            if (!messageTitle.toLowerCase().includes(headers.debrisField.toLowerCase())) {
                //ignore anything that's not a DF harvest report
                return;
            }

            // send message to service worker
            const workerMessage: TrackDebrisFieldReportMessage = {
                type: MessageType.TrackDebrisFieldReport,
                ogameMeta: getOgameMeta(),
                data: {
                    id,
                    date,
                    text,
                    html,
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
            console.error(error);

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
