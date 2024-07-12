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
import { OgameRawMessageType } from "@/shared/models/ogame/messages/OgameRawMessageType";
import { parseCoordinates } from "@/shared/utils/parseCoordinates";
import { PlanetType } from "@/shared/models/ogame/common/PlanetType";
 
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

function trackDebrisFieldReports() {
    const messages = Array.from(document.querySelectorAll('div.msg[data-msg-id]'))
        .filter(elem => {
            const messageType = parseIntSafe(
                elem.querySelector('.rawMessageData')?.getAttribute('data-raw-messagetype') 
                ?? '-1' // for some reason not all messages have a type attribute, e.g. espionage reports, so we fall back to something unused
            );

            return messageType == OgameRawMessageType.debrisFieldHarvestReport 
                && !elem.classList.contains(cssClasses.messages.base);
        });

    messages.forEach(msg => {
        const id = parseIntSafe(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id'), 10);

        try {
            // prepare message to service worker
            const element = msg.querySelector('.rawMessageData') ?? _throw(`Cannot find rawMessageData element`);
            const {
                timestamp: date, 
                targetcoordinates: coords, 
                recycledresources: recycledResources, 
            } = getMessageAttributes(element, {
                timestamp: value => parseIntSafe(value, 10) * 1000,
                targetcoordinates: value => parseCoordinates(value, PlanetType.debrisField),
                recycledresources: json => JSON.parse(json) as { metal: number; crystal: number; deuterium: number },
            }); 

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

export const debrisFieldTracking = {
    onMessage,
    track: trackDebrisFieldReports,
};