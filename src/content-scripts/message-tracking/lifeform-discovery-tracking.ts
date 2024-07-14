import { Message } from "../../shared/messages/Message";
import { MessageType } from "../../shared/messages/MessageType";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { _log, _logDebug, _logWarning, _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { getMessageAttributes } from "../../shared/utils/getMessageAttributes";
import { cssClasses, addOrSetCustomMessageContent, formatNumber } from "./utils";
import { ogameMetasEqual } from "../../shared/ogame-web/ogameMetasEqual";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { sendMessage } from "@/shared/communication/sendMessage";
import { MessageTrackingErrorMessage } from "@/shared/messages/tracking/misc";
import { messageTrackingUuid } from "@/shared/uuid";
import { v4 } from "uuid";
import { settingsWrapper } from "./main";
import { LifeformDiscoveryMessage, TrackLifeformDiscoveryMessage } from "@/shared/messages/tracking/lifeform-discoveries";
import { LifeformDiscoveryEvent } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEvent";
import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { LifeformType, ValidLifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { LifeformDiscoveryEventArtifactFindingSize } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize";
import { OgameRawMessageType } from "@/shared/models/ogame/messages/OgameRawMessageType";
import { LifeformDiscoveryTrackingNotificationMessage, LifeformDiscoveryTrackingNotificationMessageData, MessageTrackingErrorNotificationMessage, NotificationType } from "@/shared/messages/notifications";
import { parseCoordinates } from "@/shared/utils/parseCoordinates";
import { OgameRawLifeformDiscoveryType } from "@/shared/models/ogame/messages/OgameRawLifeformDiscoveryType";
import { OgameRawArtifactFindSize } from "@/shared/models/ogame/messages/OgameRawArtifactFindSize";
import { OgameRawLifeformType } from "@/shared/models/ogame/messages/OgameRawLifeformType";

const errorId = v4();
const lifeformDiscoveriesId = v4();

const waitingForMessageResult: Record<number, true> = {};
const failedToTrackMessages: Record<number, true> = {};
const totalLifeformDiscoveryResult: LifeformDiscoveryTrackingNotificationMessageData = {
    events: {
        [LifeformDiscoveryEventType.nothing]: 0,
        [LifeformDiscoveryEventType.lostShip]: 0,
        [LifeformDiscoveryEventType.newLifeformFound]: 0,
        [LifeformDiscoveryEventType.knownLifeformFound]: 0,
        [LifeformDiscoveryEventType.artifacts]: 0,
    },
    artifacts: 0,
    newLifeforms: [],
    lifeformExperience: {
        [LifeformType.humans]: 0,
        [LifeformType.rocktal]: 0,
        [LifeformType.mechas]: 0,
        [LifeformType.kaelesh]: 0,
    },
};

function onMessage(message: Message<MessageType, any>) {
    const ogameMeta = getOgameMeta();
    if (!ogameMetasEqual(ogameMeta, message.ogameMeta)) {
        return;
    }

    switch (message.type) {

        case MessageType.LifeformDiscovery:
        case MessageType.NewLifeformDiscovery: {
            const msg = message as LifeformDiscoveryMessage;
            const div = document.querySelector(`div.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find lifeform discovery message with id '${msg.data.id}'`);

            div.classList.remove(cssClasses.messages.waitingToBeProcessed);
            div.classList.add(cssClasses.messages.processed);
            if (settingsWrapper.settings.messageTracking.showSimplifiedResults) {
                div.classList.add(cssClasses.messages.hideContent);
            }

            addLifeformDiscoveryResultContent(div, msg.data);

            if (message.type == MessageType.NewLifeformDiscovery) {
                updateLifeformDiscoveryResults(msg);
            }
            break;
        }

        case MessageType.TrackingError: {
            const { type, id } = (message as MessageTrackingErrorMessage).data;
            if (!['expedition', 'lifeform-discovery'].includes(type)) {
                break;
            }

            const div = document.querySelector(`div.msg[data-msg-id="${id}"]`) ?? _throw(`failed to find message with id '${id}'`);

            div.classList.remove(cssClasses.messages.waitingToBeProcessed);
            div.classList.add(cssClasses.messages.error);
            addOrSetCustomMessageContent(div, false);

            delete waitingForMessageResult[id];
            failedToTrackMessages[id] = true;
            sendNotificationMessages();
            break;
        }
    }
}

function trackMessages(messages: Element[]) {
    const unprocessedMessages = trackLifeformDiscoveries(messages);

    unprocessedMessages.forEach(msg => {
        const id = parseIntSafe(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id'), 10);

        msg.classList.add(cssClasses.messages.base, cssClasses.messages.error);
        addOrSetCustomMessageContent(msg, false);

        delete waitingForMessageResult[id];
        failedToTrackMessages[id] = true;
        sendNotificationMessages();
    });
}

export const lifeformDiscoveryTracking = {
    onMessage,
    track: trackMessages,
    messageType: OgameRawMessageType.lifeformDiscovery,
};

function trackLifeformDiscoveries(messages: Element[]) {
    const unprocessedMessages: Element[] = [];

    messages.forEach(msg => {
        const id = parseIntSafe(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id'), 10);

        try {
            const element = msg.querySelector('.rawMessageData') ?? _throw(`Cannot find rawMessageData element`);  
            
            const {
                timestamp: date,
                coords,
                discoverytype: rawType,
                artifactssize: rawArtifactsFindSize,
                artifactsfound: rawArtifactsAmount,
                lifeform: rawLifeform,
                lifeformalreadyowned: rawLifeformAlreadyOwned,
                lifeformgainedexperience: rawLifeformExperience,
            } = getMessageAttributes(element, {
                timestamp: {
                    optional: false,
                    conversion: value => parseIntSafe(value, 10) * 1000,
                },
                coords: {
                    optional: false,
                    conversion: value => parseCoordinates(value),
                },
                discoverytype: {
                    optional: true,
                    conversion: value => value as OgameRawLifeformDiscoveryType,
                },
                artifactssize: {
                    optional: true,
                    conversion: value => value as OgameRawArtifactFindSize,
                },
                artifactsfound: {
                    optional: true,
                    conversion: value => parseIntSafe(value),
                },
                lifeform: {
                    optional: true,
                    conversion: value => parseIntSafe(value) as OgameRawLifeformType,
                },
                lifeformgainedexperience: {
                    optional: true,
                    conversion: value => parseIntSafe(value),
                },
                lifeformalreadyowned: {
                    optional: true,
                    conversion: value => value == '1',
                },
            });

            if (isNaN(date)) {
                _throw('Message timestamp is NaN');
            }

            const workerMessage: TrackLifeformDiscoveryMessage = {
                type: MessageType.TrackLifeformDiscovery,
                ogameMeta: getOgameMeta(),
                data: {
                    id,
                    date,
                    type: rawType ?? OgameRawLifeformDiscoveryType.none,
                    artifactsFound: rawArtifactsAmount,
                    artifactsSize: rawArtifactsFindSize,
                    lifeform: rawLifeform,
                    lifeformExperience: rawLifeformExperience,
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

            waitingForMessageResult[id] = true;
        } catch (error) {
            console.error(error);
            unprocessedMessages.push(msg);
        }
    });

    return unprocessedMessages;
}

function sendNotificationMessages() {
    const failed = Object.keys(failedToTrackMessages).length;
    if (failed > 0) {
        sendErrorNotificationMessage(failed);
    }

    const lifeformDiscoveryCount = Object.values(totalLifeformDiscoveryResult.events).reduce((acc, cur) => acc + cur, 0);
    if (lifeformDiscoveryCount > 0) {
        const msg: LifeformDiscoveryTrackingNotificationMessage = {
            type: MessageType.Notification,
            ogameMeta: getOgameMeta(),
            senderUuid: messageTrackingUuid,
            data: {
                type: NotificationType.LifeformDiscoveryTracking,
                messageId: lifeformDiscoveriesId,
                ...totalLifeformDiscoveryResult,
            },
        };
        sendMessage(msg);
    }
}

function sendErrorNotificationMessage(failed: number) {
    const msg: MessageTrackingErrorNotificationMessage = {
        type: MessageType.Notification,
        ogameMeta: getOgameMeta(),
        senderUuid: messageTrackingUuid,
        data: {
            type: NotificationType.MessageTrackingError,
            messageId: errorId,
            count: failed,
        },
    };
    sendMessage(msg);
}

function addLifeformDiscoveryResultContent(li: Element, lifeformDiscovery: LifeformDiscoveryEvent) {
    li.classList.add(cssClasses.messages.lifeformDiscovery);

    const html = getLifeformDiscoveryResultContentHtml(lifeformDiscovery);
    addOrSetCustomMessageContent(li, html);
}

function getLifeformDiscoveryResultContentHtml(lifeformDiscovery: LifeformDiscoveryEvent) {
    switch (lifeformDiscovery.type) {
        case LifeformDiscoveryEventType.lostShip: {
            return `
                <div class="${getLifeformDiscoveryResultClass(LifeformDiscoveryEventType.lostShip)}">
                    <div class="mdi mdi-skull-crossbones-outline"></div>
                </div>
            `;
        }

        case LifeformDiscoveryEventType.nothing: {
            return `
                <div class="${getLifeformDiscoveryResultClass(LifeformDiscoveryEventType.nothing)}">
                    <div class="mdi mdi-close"></div>
                </div>
            `;
        }

        case LifeformDiscoveryEventType.knownLifeformFound: {
            return `
                <div class="${getLifeformDiscoveryResultClass(lifeformDiscovery.type)}">
                    <div class="${getLifeformClass(lifeformDiscovery.lifeform)}"></div>
                    <span style="font-weight: bold;">+${lifeformDiscovery.experience} XP</span>
                </div>
            `;
        }

        case LifeformDiscoveryEventType.newLifeformFound: {
            return `
                <div class="${getLifeformDiscoveryResultClass(lifeformDiscovery.type)}">
                    <span class="mdi mdi-new-box"></span>
                    <div class="${getLifeformClass(lifeformDiscovery.lifeform)}"></div>
                </div>
            `;
        }

        case LifeformDiscoveryEventType.artifacts: {
            return `
                <div class="${getLifeformDiscoveryResultClass(lifeformDiscovery.type, lifeformDiscovery.size)}">
                    <div class="${getLifeformDiscoveryMissionArtifactSizeIconClass(lifeformDiscovery.size)}"></div>
                    <span class="mdi mdi-pyramid${lifeformDiscovery.size == LifeformDiscoveryEventArtifactFindingSize.storageFull ? '-off' : ''}"></span>
                    <span>${lifeformDiscovery.artifacts}</span>
                </div>
            `;
        }

        default: _throw('unknown lifeform discovery type');
    }
}

function getLifeformDiscoveryResultClass(result: LifeformDiscoveryEventType, size?: LifeformDiscoveryEventArtifactFindingSize) {
    const cssClass = `ogame-tracker-lifeform-discovery-result ogame-tracker-lifeform-discovery-result--${result}`;
    if (size == null) {
        return cssClass;
    }

    return `${cssClass} ogame-tracker-lifeform-discovery-result--artifacts--size-${size}`
}

function getLifeformDiscoveryMissionArtifactSizeIconClass(size: LifeformDiscoveryEventArtifactFindingSize) {
    return 'ogame-tracker-lifeform-discovery-result--size-icon mdi ' + ({
        [LifeformDiscoveryEventArtifactFindingSize.small]: 'mdi-hexagon-slice-1',
        [LifeformDiscoveryEventArtifactFindingSize.medium]: 'mdi-hexagon-slice-3',
        [LifeformDiscoveryEventArtifactFindingSize.large]: 'mdi-hexagon-slice-5',
        [LifeformDiscoveryEventArtifactFindingSize.storageFull]: 'mdi-hexagon-outline',
    }[size]);
}

function getLifeformClass(lifeform: ValidLifeformType) {
    const ogameClass = {
        [LifeformType.humans]: 'lifeform-item-icon small lifeform1',
        [LifeformType.rocktal]: 'lifeform-item-icon small lifeform2',
        [LifeformType.mechas]: 'lifeform-item-icon small lifeform3',
        [LifeformType.kaelesh]: 'lifeform-item-icon small lifeform4',
    }[lifeform];

    return `${ogameClass} ogame-tracker_lifeform-icon ogame-tracker_lifeform-icon--${lifeform}`;
}

function updateLifeformDiscoveryResults(msg: LifeformDiscoveryMessage) {
    delete waitingForMessageResult[msg.data.id];
    totalLifeformDiscoveryResult.events[msg.data.type]++;

    switch (msg.data.type) {
        case LifeformDiscoveryEventType.newLifeformFound: {
            totalLifeformDiscoveryResult.newLifeforms.push(msg.data.lifeform);
            break;
        }

        case LifeformDiscoveryEventType.knownLifeformFound: {
            totalLifeformDiscoveryResult.lifeformExperience[msg.data.lifeform] += msg.data.experience;
            break;
        }

        case LifeformDiscoveryEventType.artifacts: {
            totalLifeformDiscoveryResult.artifacts += msg.data.artifacts;
            break;
        }

        default: break;
    }
    sendNotificationMessages();
}