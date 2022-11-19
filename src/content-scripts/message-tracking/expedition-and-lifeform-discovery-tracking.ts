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
import { ExpeditionEvent, ExpeditionFindableShipType } from "../../shared/models/expeditions/ExpeditionEvents";
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
import { ExpeditionTrackingLostFleetNotificationMessage, ExpeditionTrackingNotificationMessage, ExpeditionTrackingNotificationMessageData, LifeformDiscoveryTrackingNotificationMessage, LifeformDiscoveryTrackingNotificationMessageData, MessageTrackingErrorNotificationMessage, NotificationType } from "@/shared/messages/notifications";
import { addCost, Cost, multiplyCost } from "@/shared/models/ogame/common/Cost";
import { ShipByTypes } from "@/shared/models/ogame/ships/ShipTypes";
import { settingsWrapper } from "./main";
import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { getLanguage } from "@/shared/i18n/getLanguage";
import { LanguageKey } from "@/shared/i18n/LanguageKey";
import { LifeformDiscoveryMessage, TrackLifeformDiscoveryMessage } from "@/shared/messages/tracking/lifeform-discoveries";
import { LifeformDiscoveryEvent } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEvent";
import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { LifeformType, ValidLifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import messageHeaders from "@/shared/i18n/ogame/messages/message-titles";
import { LifeformDiscoveryEventArtifactFindingSize } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize";

let tabContent: Element | null = null;

const errorId = v4();
const expeditionNotificationIds = {
    result: v4(),
    lostFleet: v4(),
};
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
    items: [],
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
    depletion: {
        unknown: 0,
        [ExpeditionDepletionLevel.none]: 0,
        [ExpeditionDepletionLevel.low]: 0,
        [ExpeditionDepletionLevel.medium]: 0,
        [ExpeditionDepletionLevel.high]: 0,
    },
};

export function initExpeditionAndLifeformDiscoveryTracking() {
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
        const observer = new MutationObserver(() => trackMessages(tabContentElement));
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
            li.classList.add(cssClasses.messages.processed);
            if (settingsWrapper.settings.messageTracking.showSimplifiedResults) {
                li.classList.add(cssClasses.messages.hideContent);
            }

            addExpeditionResultContent(li, msg.data);

            if (message.type == MessageType.NewExpedition) {
                updateExpeditionResults(msg);
            }
            break;
        }

        case MessageType.LifeformDiscovery:
        case MessageType.NewLifeformDiscovery: {
            const msg = message as LifeformDiscoveryMessage;
            const li = document.querySelector(`li.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find lifeform discovery message with id '${msg.data.id}'`);

            li.classList.remove(cssClasses.messages.waitingToBeProcessed);
            li.classList.add(cssClasses.messages.processed);
            if (settingsWrapper.settings.messageTracking.showSimplifiedResults) {
                li.classList.add(cssClasses.messages.hideContent);
            }

            addLifeformDiscoveryResultContent(li, msg.data);

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

            const li = document.querySelector(`li.msg[data-msg-id="${id}"]`) ?? _throw(`failed to find message with id '${id}'`);

            li.classList.remove(cssClasses.messages.waitingToBeProcessed);
            li.classList.add(cssClasses.messages.error);
            addOrSetCustomMessageContent(li, false);

            delete waitingForMessageResult[id];
            failedToTrackMessages[id] = true;
            sendNotificationMessages();
            break;
        }
    }
}

function trackMessages(elem: Element) {
    const ogameMeta = getOgameMeta();
    const lang = getLanguage(ogameMeta.language);

    let messages = Array.from(elem.querySelectorAll('li.msg[data-msg-id]'))
        .filter(elem => !elem.classList.contains(cssClasses.messages.base));

    if (lang != null) {
        messages = trackExpeditionsOrLifeformDiscoveries(lang, messages);
    }

    messages.forEach(msg => {
        const id = parseIntSafe(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id'), 10);

        msg.classList.add(cssClasses.messages.base, cssClasses.messages.error);
        addOrSetCustomMessageContent(msg, false);

        delete waitingForMessageResult[id];
        failedToTrackMessages[id] = true;
        sendNotificationMessages();
    });
}

function trackExpeditionsOrLifeformDiscoveries(lang: LanguageKey, messages: Element[]) {
    const unprocessedMessages: Element[] = [];
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

            const messageTypeHeaders = {
                [MessageType.TrackExpedition]: headers.expedition,
                [MessageType.TrackLifeformDiscovery]: headers.lifeformDiscovery,
            };

            const messageTitle = msg.querySelector('.msg_title')?.textContent ?? '';
            const messageType = (Object.keys(messageTypeHeaders) as (keyof typeof messageTypeHeaders)[])
                .find(msgType => messageTitle.includes(messageTypeHeaders[msgType]) == true);
            if (messageType == null) {
                _throw(`unknown message type '${messageTitle}'`);
            }

            // send message to service worker
            const workerMessage: TrackExpeditionMessage | TrackLifeformDiscoveryMessage = {
                type: messageType,
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

    const expeditionCount = Object.values(totalExpeditionResult.events).reduce((acc, cur) => acc + cur, 0);
    if (expeditionCount > 0) {
        const msg: ExpeditionTrackingNotificationMessage = {
            type: MessageType.Notification,
            ogameMeta: getOgameMeta(),
            senderUuid: messageTrackingUuid,
            data: {
                type: NotificationType.ExpeditionTracking,
                messageId: expeditionNotificationIds.result,
                ...totalExpeditionResult,
            },
        };
        sendMessage(msg);

        if (totalExpeditionResult.events.lostFleet > 0) {
            const msg: ExpeditionTrackingLostFleetNotificationMessage = {
                type: MessageType.Notification,
                ogameMeta: getOgameMeta(),
                senderUuid: messageTrackingUuid,
                data: {
                    type: NotificationType.ExpeditionTrackingLostFleet,
                    messageId: expeditionNotificationIds.lostFleet,
                    count: totalExpeditionResult.events.lostFleet,
                },
            };
            sendMessage(msg);
        }
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
                    <span class="mdi mdi-flare"></span>
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
        [LifeformDiscoveryEventArtifactFindingSize.storageFull]: 'mdi-hexagon-slice-6',
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

function addExpeditionResultContent(li: Element, expedition: ExpeditionEvent) {
    li.classList.add(cssClasses.messages.expedition);

    const resultHtml = getExpeditionResultContentHtml(expedition);
    const depletionHtml = getExpeditionDepletionHtml(expedition);
    const html = resultHtml + depletionHtml;

    addOrSetCustomMessageContent(li, html);
}

function getExpeditionDepletionHtml(expedition: ExpeditionEvent): string {
    if (expedition.depletion == null) {
        return '';
    }

    const depletionLevelClass = getDepletionLevelClass(expedition.depletion);
    return `<span class="${depletionLevelClass}"></span>`
}

function getExpeditionResultContentHtml(expedition: ExpeditionEvent): string {
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

            return `
                <div class="${getExpeditionResultClass(ExpeditionEventType.resources, expedition.size)}">
                    <div class="${getExpeditionSizeIconClass(expedition.size)}"></div>
                    <div class="ogame-tracker-resource ${resource}"></div>
                    <div class="${resource}">${formatNumber(amount)}</div>
                </div>
            `;
        }

        case ExpeditionEventType.fleet: {
            const ships = Object.keys(expedition.fleet)
                .map(ship => parseIntSafe(ship, 10) as ExpeditionFindableShipType)
                .filter(key => (expedition.fleet[key] ?? 0) > 0);

            const units = ships.reduce<Cost>((total, ship) => {
                const shipCost = multiplyCost(ShipByTypes[ship].getCost(), expedition.fleet[ship] ?? 0);
                const adjustedCost = multiplyCost(shipCost, settingsWrapper.settings.expeditionFoundShipsResourceUnits.factor);
                return addCost(total, adjustedCost);
            }, { metal: 0, crystal: 0, deuterium: 0, energy: 0 })

            return `
                <div class="ogame-tracker-expedition-result--fleet_wrapper">
                    <div class="${getExpeditionResultClass(ExpeditionEventType.fleet, expedition.size)}">
                        <div class="${getExpeditionSizeIconClass(expedition.size)}"></div>
                        ${ships.map(ship => `
                            <div class="ship-count-item">
                                <div class="ogame-tracker-ship ship-${ship}"></div>
                                <div>${formatNumber(expedition.fleet[ship] ?? 0)}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="resource-units">
                        ${units.metal > 0 ? `
                        <div class="ogame-tracker-resource metal"></div>
                        <div class="metal">${formatNumber(units.metal)}</div>
                        ` : ''}
                        ${units.crystal > 0 ? `
                        <div class="ogame-tracker-resource crystal"></div>
                        <div class="crystal">${formatNumber(units.crystal)}</div>
                        ` : ''}
                        ${units.deuterium > 0 ? `
                        <div class="ogame-tracker-resource deuterium"></div>
                        <div class="deuterium">${formatNumber(units.deuterium)}</div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        case ExpeditionEventType.darkMatter: {
            return `
                <div class="${getExpeditionResultClass(ExpeditionEventType.darkMatter, expedition.size)}">
                    <div class="${getExpeditionSizeIconClass(expedition.size)}"></div>
                    <div class="ogame-tracker-resource dark-matter"></div>
                    <div class="dark-matter">${formatNumber(expedition.darkMatter)}</div>
                </div>
            `;
        }

        case ExpeditionEventType.delay: {
            return `
                <div class="${getExpeditionResultClass(ExpeditionEventType.delay)}">
                    <div class="mdi mdi-clock-outline"></div>
                </div>
            `;
        }

        case ExpeditionEventType.early: {
            return `
                <div class="${getExpeditionResultClass(ExpeditionEventType.early)}">
                    <div class="mdi mdi-clock-outline"></div>
                </div>
            `;
        }

        case ExpeditionEventType.pirates: {
            return `
                <div class="${getExpeditionResultClass(ExpeditionEventType.pirates, expedition.size)}">
                    <div class="${getExpeditionSizeIconClass(expedition.size)}"></div>
                    <div class="mdi mdi-pirate"></div>
                </div>
            `;
        }

        case ExpeditionEventType.aliens: {
            return `
                <div class="${getExpeditionResultClass(ExpeditionEventType.aliens, expedition.size)}">
                    <div class="${getExpeditionSizeIconClass(expedition.size)}"></div>
                    <div class="mdi mdi-alien"></div>
                </div>
            `;
        }

        case ExpeditionEventType.lostFleet: {
            return `
                <div class="${getExpeditionResultClass(ExpeditionEventType.lostFleet)}">
                    <div class="mdi mdi-cross"></div>
                </div>
            `;
        }

        case ExpeditionEventType.nothing: {
            return `
                <div class="${getExpeditionResultClass(ExpeditionEventType.nothing)}">
                    <div class="mdi mdi-close"></div>
                </div>
            `;
        }

        case ExpeditionEventType.item: {
            const item = Items[expedition.itemHash];
            const imageUrl = chrome.runtime.getURL(`/img/ogame/items/${item.image}.png`);
            return `
                <div class="${getExpeditionResultClass(ExpeditionEventType.item)}">
                    <img src="${imageUrl}" class="item-grade--${item.grade}" />
                </div>
            `;
        }

        case ExpeditionEventType.trader: {
            return `
                <div class="${getExpeditionResultClass(ExpeditionEventType.trader)}">
                    <div class="mdi mdi-swap-horizontal-bold"></div>
                </div>
            `;
        }
        default: _throw('unknown expedition type');
    }
}

function getDepletionLevelClass(level: ExpeditionDepletionLevel) {
    return `ogame-tracker-expedition-result--depletion-level ogame-tracker-expedition-result--depletion-level-${level} mdi ` + ({
        [ExpeditionDepletionLevel.none]: 'mdi-signal-cellular-outline',
        [ExpeditionDepletionLevel.low]: 'mdi-signal-cellular-1',
        [ExpeditionDepletionLevel.medium]: 'mdi-signal-cellular-2',
        [ExpeditionDepletionLevel.high]: 'mdi-signal-cellular-3',
    }[level]);
}

function getExpeditionSizeIconClass(size: ExpeditionEventSize) {
    return 'ogame-tracker-expedition--size-icon mdi ' + ({
        [ExpeditionEventSize.small]: 'mdi-hexagon-slice-1',
        [ExpeditionEventSize.medium]: 'mdi-hexagon-slice-3',
        [ExpeditionEventSize.large]: 'mdi-hexagon-slice-5',
    }[size]);
}

function getExpeditionResultClass(result: ExpeditionEventType, size?: ExpeditionEventSize) {
    const cssClass = `ogame-tracker-expedition-result ogame-tracker-expedition-result--${result}`;
    if (size == null) {
        return cssClass;
    }

    return `${cssClass} ogame-tracker-expedition-result--size-${size}`;
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

function updateExpeditionResults(msg: ExpeditionMessage) {
    delete waitingForMessageResult[msg.data.id];
    totalExpeditionResult.events[msg.data.type]++;

    totalExpeditionResult.depletion[msg.data.depletion ?? 'unknown']++;

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

        case ExpeditionEventType.item: {
            totalExpeditionResult.items.push(msg.data.itemHash);
            break;
        }

        default: break;
    }
    sendNotificationMessages();
}
