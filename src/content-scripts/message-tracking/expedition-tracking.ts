import { parse } from "date-fns";
import { Message } from "../../shared/messages/Message";
import { MessageType } from "../../shared/messages/MessageType";
import { ExpeditionMessage, TrackExpeditionMessage } from "../../shared/messages/tracking/expeditions";
import { dateTimeFormat } from "../../shared/ogame-web/constants";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { _log, _logDebug, _logWarning } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { tabIds, cssClasses, addOrSetCustomMessageContent, formatNumber } from "./utils";
import { ExpeditionEvent, ExpeditionEventResources, ExpeditionFindableShipType } from "../../shared/models/expeditions/ExpeditionEvents";
import { ExpeditionEventType } from "../../shared/models/expeditions/ExpeditionEventType";
import { ExpeditionEventSize } from "../../shared/models/expeditions/ExpeditionEventSize";
import { ResourceType } from "../../shared/models/ogame/resources/ResourceType";
import { Items } from "../../shared/models/ogame/items/Items";
import { ogameMetasEqual } from "../../shared/ogame-web/ogameMetasEqual";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { sendMessage } from "@/shared/communication/sendMessage";
import { MessageTrackingErrorMessage } from "@/shared/messages/tracking/misc";
import { messageTrackingUuid } from "@/shared/uuid";
import { v4 } from "uuid";
import { ShipType } from "@/shared/models/ogame/ships/ShipType";
import { ExpeditionTrackingNotificationMessage, ExpeditionTrackingNotificationMessageData, MessageTrackingErrorNotificationMessage, NotificationType } from "@/shared/messages/notifications";

let tabContent: Element | null = null;

const notificationIds = {
    result: v4(),
    error: v4(),
};
const waitingForExpeditions: Record<number, true> = {};
const failedToTrackExpeditions: Record<number, true> = {};
const totalExpeditionResult: ExpeditionTrackingNotificationMessageData = {
    resources: {
        [ResourceType.metal]: 0,
        [ResourceType.crystal]: 0,
        [ResourceType.deuterium]: 0,
    },
    ships: {
        [ShipType.lightFighter]: 0,
        [ShipType.heavyFighter]: 0,
        [ShipType.cruiser]: 0,
        [ShipType.battleship]: 0,
        [ShipType.bomber]: 0,
        [ShipType.battlecruiser]: 0,
        [ShipType.destroyer]: 0,
        [ShipType.reaper]: 0,
        [ShipType.pathfinder]: 0,
        [ShipType.smallCargo]: 0,
        [ShipType.largeCargo]: 0,
        [ShipType.espionageProbe]: 0,
    },
    darkMatter: 0,
    events: {
        [ExpeditionEventType.nothing]: 0,
        [ExpeditionEventType.resources]: 0,
        [ExpeditionEventType.fleet]: 0,
        [ExpeditionEventType.delay]: 0,
        [ExpeditionEventType.early]: 0,
        [ExpeditionEventType.darkMatter]: 0,
        [ExpeditionEventType.pirates]: 0,
        [ExpeditionEventType.aliens]: 0,
        [ExpeditionEventType.item]: 0,
        [ExpeditionEventType.trader]: 0,
        [ExpeditionEventType.lostFleet]: 0,
    },
};

export function initExpeditionTracking() {
    chrome.runtime.onMessage.addListener(message => onMessage(message));

    const contentElem = document.querySelector('#content .content') ?? _throw('Cannot find content element');
    const initObserver = new MutationObserver(() => {
        if (tabContent?.isConnected != true) {
            setupExpeditionMessageObserver();
        }
    });
    initObserver.observe(contentElem, { subtree: true, childList: true });
}

function setupExpeditionMessageObserver() {
    const tabLabel = document.querySelector(`[id^="subtabs-"][data-tabid="${tabIds.expedition}"]`) ?? _throw('Cannot find label of expedition messages');
    const tabContentId = tabLabel.getAttribute('aria-controls') ?? _throw('Cannot find id of expedition messages tab content');
    tabContent = document.querySelector(`#${tabContentId}`);
    const tabContentElement = tabContent ?? _throw('Cannot find content element of expedition messages');

    const meta = getOgameMeta();
    if (isSupportedLanguage(meta.language)) {
        const observer = new MutationObserver(() => trackExpeditions(tabContentElement));
        observer.observe(tabContentElement, { childList: true, subtree: true });
    }
}

function onMessage(message: Message<MessageType, any>) {
    const ogameMeta = getOgameMeta();
    if (!ogameMetasEqual(ogameMeta, message.ogameMeta)) {
        return;
    }

    switch (message.type) {
        case MessageType.Expedition:
        case MessageType.NewExpedition: {
            const msg = message as ExpeditionMessage;
            const li = document.querySelector(`li.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find expedition message with id '${msg.data.id}'`);

            li.classList.remove(cssClasses.messages.waitingToBeProcessed);
            li.classList.add(cssClasses.messages.hideContent, cssClasses.messages.processed);
            addExpeditionResultContent(li, msg.data);

            if (message.type == MessageType.NewExpedition) {
                updateExpeditionResults(msg);
            }
            break;
        }

        case MessageType.TrackingError: {
            const msg = message as MessageTrackingErrorMessage;
            const li = document.querySelector(`li.msg[data-msg-id="${msg.data}"]`) ?? _throw(`failed to find expedition message with id '${msg.data}'`);

            li.classList.remove(cssClasses.messages.waitingToBeProcessed);
            li.classList.add(cssClasses.messages.error);
            addOrSetCustomMessageContent(li, false);

            delete waitingForExpeditions[msg.data];
            failedToTrackExpeditions[msg.data] = true;
            sendNotificationMessages();
            break;
        }
    }
}

function trackExpeditions(elem: Element) {
    const messages = Array.from(elem.querySelectorAll('li.msg[data-msg-id]'))
        .filter(elem => !elem.classList.contains(cssClasses.messages.base));

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

            // send message to service worker
            const workerMessage: TrackExpeditionMessage = {
                type: MessageType.TrackExpedition,
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

            waitingForExpeditions[id] = true;
        } catch (error) {
            console.error(error);

            msg.classList.add(cssClasses.messages.base, cssClasses.messages.error);
            addOrSetCustomMessageContent(msg, false);

            delete waitingForExpeditions[id];
            failedToTrackExpeditions[id] = true;
            sendNotificationMessages();
        }
    });
}

function sendNotificationMessages() {
    const failed = Object.keys(failedToTrackExpeditions).length;
    if (failed > 0) {
        sendErrorNotificationMessage(failed);
    }

    const msg: ExpeditionTrackingNotificationMessage = {
        type: MessageType.Notification,
        ogameMeta: getOgameMeta(),
        senderUuid: messageTrackingUuid,
        data: {
            type: NotificationType.ExpeditionTracking,
            messageId: notificationIds.result,
            ...totalExpeditionResult,
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



function addExpeditionResultContent(li: Element, expedition: ExpeditionEvent) {
    li.classList.add(cssClasses.messages.expedition);

    switch (expedition.type) {
        case ExpeditionEventType.resources: {
            const resources = expedition.resources;
            let resource: ResourceType;
            let amount: number;
            if (resources.metal > 0) {
                [resource, amount] = [ResourceType.metal, resources.metal];
            } else if (resources.crystal > 0) {
                [resource, amount] = [ResourceType.crystal, resources.crystal];
            } else {
                [resource, amount] = [ResourceType.deuterium, resources.deuterium];
            }

            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.resources, expedition.size)}">
                    <div class="${getSizeIconClass(expedition.size)}"></div>
                    <div class="ogame-tracker-resource ${resource}"></div>
                    <div class="${resource}">${formatNumber(amount)}</div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.fleet: {
            const ships = Object.keys(expedition.fleet)
                .map(ship => parseIntSafe(ship, 10) as ExpeditionFindableShipType)
                .filter(key => (expedition.fleet[key] ?? 0) > 0);

            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.fleet, expedition.size)}">
                    <div class="${getSizeIconClass(expedition.size)}"></div>
                    ${ships.map(ship => `
                        <div class="ship-count-item">
                            <div class="ogame-tracker-ship ship-${ship}"></div>
                            <div>${formatNumber(expedition.fleet[ship] ?? 0)}</div>
                        </div>
                    `).join('')}
                </div>
            `);
            break;
        }

        case ExpeditionEventType.darkMatter: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.darkMatter, expedition.size)}">
                    <div class="${getSizeIconClass(expedition.size)}"></div>
                    <div class="ogame-tracker-resource dark-matter"></div>
                    <div class="dark-matter">${formatNumber(expedition.darkMatter)}</div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.delay: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.delay)}">
                    <div class="mdi mdi-clock-outline"></div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.early: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.early)}">
                    <div class="mdi mdi-clock-outline"></div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.pirates: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.pirates, expedition.size)}">
                    <div class="${getSizeIconClass(expedition.size)}"></div>
                    <div class="mdi mdi-pirate"></div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.aliens: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.aliens, expedition.size)}">
                    <div class="${getSizeIconClass(expedition.size)}"></div>
                    <div class="mdi mdi-alien"></div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.lostFleet: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.lostFleet)}">
                    <div class="mdi mdi-cross"></div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.nothing: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.nothing)}">
                    <div class="mdi mdi-close"></div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.item: {
            const item = Items[expedition.itemHash];
            const imageUrl = chrome.runtime.getURL(`/img/ogame/items/${item.image}.png`);
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.item)}">
                    <img src="${imageUrl}" class="item-grade--${item.grade}" />
                </div>
            `);
            break;
        }

        case ExpeditionEventType.trader: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.trader)}">
                    <div class="mdi mdi-swap-horizontal-bold"></div>
                </div>
            `);
            break;
        }
    }
}

function getSizeIconClass(size: ExpeditionEventSize) {
    return 'ogame-tracker-expedition--size-icon mdi ' + ({
        [ExpeditionEventSize.small]: 'mdi-hexagon-slice-1',
        [ExpeditionEventSize.medium]: 'mdi-hexagon-slice-3',
        [ExpeditionEventSize.large]: 'mdi-hexagon-slice-5',
    }[size]);
}

function getResultClass(result: ExpeditionEventType, size?: ExpeditionEventSize) {
    const cssClass = `ogame-tracker-expedition-result ogame-tracker-expedition-result--${result}`;
    if (size == null) {
        return cssClass;
    }

    return `${cssClass} ogame-tracker-expedition-result--size-${size}`;
}

function updateExpeditionResults(msg: ExpeditionMessage) {
    delete waitingForExpeditions[msg.data.id];
    totalExpeditionResult.events[msg.data.type]++;
    switch (msg.data.type) {
        case ExpeditionEventType.resources: {
            const resources = msg.data.resources;
            [ResourceType.metal, ResourceType.crystal, ResourceType.deuterium]
                .forEach(resource => totalExpeditionResult.resources[resource] += resources[resource]);
            break;
        }

        case ExpeditionEventType.fleet: {
            const fleet = msg.data.fleet;
            Object.keys(fleet)
                .map(ship => parseIntSafe(ship, 10) as ExpeditionFindableShipType)
                .forEach(ship => totalExpeditionResult.ships[ship] += (fleet[ship] ?? 0));
            break;
        }

        case ExpeditionEventType.darkMatter: {
            totalExpeditionResult.darkMatter += msg.data.darkMatter;
            break;
        }

        default: break;
    }
    sendNotificationMessages();
}
