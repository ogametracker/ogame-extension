import { Message } from "../../shared/messages/Message";
import { MessageType } from "../../shared/messages/MessageType";
import { ExpeditionMessage, TrackExpeditionMessage } from "../../shared/messages/tracking/expeditions";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { _log, _logDebug, _logWarning, _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { getMessageAttributes } from "../../shared/utils/getMessageAttributes";
import { tabIds, cssClasses, addOrSetCustomMessageContent, formatNumber } from "./utils";
import { ExpeditionEvent, ExpeditionEventCombatSize, ExpeditionFindableShipType, ExpeditionFindableShipTypes } from "../../shared/models/expeditions/ExpeditionEvents";
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

    const contentElem = document.querySelector('#pageContent .content') ?? _throw('Cannot find content element');
    const initObserver = new MutationObserver(() => {
        if (tabContent?.isConnected != true) {
            setupExpeditionMessageObserver();
        }
    });
    initObserver.observe(contentElem, { subtree: true, childList: true });
}

function setupExpeditionMessageObserver() {
    tabContent = document.querySelector(`.messagesHolder`);
    const tabContentElement = tabContent ?? _throw('Cannot find messages holder element');

    const meta = getOgameMeta();
    if (isSupportedLanguage(meta.userLanguage)) {
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
            const div = document.querySelector(`div.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find expedition message with id '${msg.data.id}'`);

            if (aprilFools_expeditionIds.has(msg.data.id)) {
                return;
            }

            div.classList.remove(cssClasses.messages.waitingToBeProcessed);
            div.classList.add(cssClasses.messages.processed);
            if (settingsWrapper.settings.messageTracking.showSimplifiedResults) {
                div.classList.add(cssClasses.messages.hideContent);
            }

            addExpeditionResultContent(div, msg.data); 

            if (message.type == MessageType.NewExpedition) {
                updateExpeditionResults(msg);
            }
            break;
        }

        case MessageType.LifeformDiscovery:
        case MessageType.NewLifeformDiscovery: {
            const msg = message as LifeformDiscoveryMessage;
            const div = document.querySelector(`div.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find lifeform discovery message with id '${msg.data.id}'`);

            if (aprilFools_lifeformDiscoveryIds.has(msg.data.id)) {
                return;
            }

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

function trackMessages(elem: Element) {
    const expeditionTab = document.querySelector(`.innerTabItem.active[data-subtab-id="${tabIds.expedition}"]`);
    if (expeditionTab == null) {
        return;
    }

    const ogameMeta = getOgameMeta();
    const lang = getLanguage(ogameMeta.userLanguage);

    let messages = Array.from(elem.querySelectorAll('div.msg[data-msg-id]'))
    .filter(elem => {
        const messageType = elem.querySelector('.rawMessageData')?.getAttribute('data-raw-messagetype');
        return !elem.classList.contains(cssClasses.messages.base) && (messageType === "41" || messageType === "61");
    });

    // In theory we might already allow ogame tracker to be used for lifeform message as the language is not required anymore.
    let unprocessedMessages = trackExpeditionsOrLifeformDiscoveries(lang, messages);
    unprocessedMessages.forEach(msg => {
        const id = parseIntSafe(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id'), 10);

        msg.classList.add(cssClasses.messages.base, cssClasses.messages.error);
        addOrSetCustomMessageContent(msg, false);

        delete waitingForMessageResult[id];
        failedToTrackMessages[id] = true;
        sendNotificationMessages();
    });
}

function trackExpeditionsOrLifeformDiscoveries(lang: LanguageKey | undefined, messages: Element[]) {
    const unprocessedMessages: Element[] = [];

    messages.forEach(msg => {
        const id = parseIntSafe(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id'), 10);

        try {
            // prepare message to service worker 
            const element = msg.querySelector('.rawMessageData') ?? _throw(`Cannot find rawMessageData element`); 
            const attributes = getMessageAttributes(element);

            // We currently do not process expeditions missions as it was not the case if the language was null
            if (lang == null && attributes["messagetype"] === "41") {
                unprocessedMessages.push(msg);
                return;
            }

            // send message to service worker
            const workerMessage = attributes["messagetype"] === "41" 
            ? prepareExpeditionWorkerMessage(msg, id, attributes) 
            : prepareLifeformDiscoveryWorkerMessage(id, attributes)
            sendMessage(workerMessage);

            // mark message as "waiting for result"
            msg.classList.add(
                cssClasses.messages.base,
                cssClasses.messages.waitingToBeProcessed,
            );
            addOrSetCustomMessageContent(msg, `<div class="ogame-tracker-loader"></div>`);

            waitingForMessageResult[id] = true;


            // april fools
            if (lang != null) 
                aprilFools_replaceMessage(workerMessage.type, lang, id, msg, workerMessage.data.date);
        } catch (error) {
            console.error(error);
            unprocessedMessages.push(msg);
        }
    });

    return unprocessedMessages;
}

function prepareExpeditionWorkerMessage(msg: Element, id: number, attr: Record<string, string>): TrackExpeditionMessage {
    const timestamp = attr["timestamp"] ?? _throw('Cannot find message timestamp');
    const date = parseInt(timestamp, 10) * 1000;
    if (isNaN(date)) {
        _throw('Message timestamp is NaN');
    }

    const messageTextElem = msg.querySelector('.msgContent') ?? _throw('Cannot find message content element');
    const text = messageTextElem.textContent ?? '';
    const html = messageTextElem.innerHTML;

    const workerMessage: TrackExpeditionMessage = {
        type: MessageType.TrackExpedition,
        ogameMeta: getOgameMeta(),
        data: {
            id,
            date,
            text,
            html,
            attributes:attr
        },
        senderUuid: messageTrackingUuid,
    };

    return workerMessage
}

function prepareLifeformDiscoveryWorkerMessage(id: number, attr: Record<string, string>): TrackLifeformDiscoveryMessage {
    const timestamp = attr["timestamp"] ?? _throw('Cannot find message timestamp');
    const discoveryType = attr["discoverytype"] || "nothing"
    const artifactsSize = attr["artifactssize"] || undefined
    const artifactsFound = attr["artifactsfound"] !== undefined ? parseIntSafe(attr["artifactsfound"]) : undefined
    const lifeform = attr["lifeform"] || undefined
    const lifeformExp = attr["lifeformgainedexperience"] !== undefined ? parseIntSafe(attr["lifeformgainedexperience"]) : undefined
    const alreadyFound = attr["lifeformalreadyowned"] === "1" || undefined

    const date = parseInt(timestamp, 10) * 1000;
    if (isNaN(date)) {
        _throw('Message timestamp is NaN');
    }

    const workerMessage: TrackLifeformDiscoveryMessage = {
        type: MessageType.TrackLifeformDiscovery,
        ogameMeta: getOgameMeta(),
        data: {
            id,
            date,
            discoveryType,
            artifactsSize,
            artifactsFound,
            lifeform,
            lifeformExp,
            alreadyFound,
        },
        senderUuid: messageTrackingUuid,
    };

    return workerMessage
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
                <div class="${getExpeditionResultClass(expedition)}">
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
                const shipCost = multiplyCost(ShipByTypes[ship].cost, expedition.fleet[ship] ?? 0);
                const adjustedCost = multiplyCost(shipCost, settingsWrapper.settings.expeditionFoundShipsResourceUnits.factor);
                return addCost(total, adjustedCost);
            }, { metal: 0, crystal: 0, deuterium: 0, energy: 0 })

            return `
                <div class="ogame-tracker-expedition-result--fleet_wrapper">
                    <div class="${getExpeditionResultClass(expedition)}">
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
                ${getOgameMeta().userLanguage == 'de' && isAprilFools(expedition.id, expedition.date)
                    ? '<div class="dm-patched"></div>'
                    : ''
                }
                <div class="${getExpeditionResultClass(expedition)}">
                    <div class="${getExpeditionSizeIconClass(expedition.size)}"></div>
                    <div class="ogame-tracker-resource dark-matter"></div>
                    <div class="dark-matter">${formatNumber(expedition.darkMatter)}</div>
                </div>
            `;
        }

        case ExpeditionEventType.delay: {
            return `
                <div class="${getExpeditionResultClass(expedition)}">
                    <div class="mdi mdi-clock-outline"></div>
                </div>
            `;
        }

        case ExpeditionEventType.early: {
            return `
                <div class="${getExpeditionResultClass(expedition)}">
                    <div class="mdi mdi-clock-outline"></div>
                </div>
            `;
        }

        case ExpeditionEventType.pirates: {
            return `
                <div class="${getExpeditionResultClass(expedition)}">
                    <div class="${getExpeditionSizeIconClass(expedition.size)}"></div>
                    <div class="mdi mdi-pirate"></div>
                </div>
            `;
        }

        case ExpeditionEventType.aliens: {
            return `
                <div class="${getExpeditionResultClass(expedition)}">
                    <div class="${getExpeditionSizeIconClass(expedition.size)}"></div>
                    <div class="mdi mdi-alien"></div>
                </div>
            `;
        }

        case ExpeditionEventType.lostFleet: {
            return `
                <div class="${getExpeditionResultClass(expedition)}">
                    <div class="mdi mdi-cross"></div>
                </div>
            `;
        }

        case ExpeditionEventType.nothing: {
            return `
                <div class="${getExpeditionResultClass(expedition)}">
                    <div class="mdi mdi-close"></div>
                </div>
            `;
        }

        case ExpeditionEventType.item: {
            const item = Items[expedition.itemHash];
            const imageUrl = chrome.runtime.getURL(`/img/ogame/items/${item.image}.png`);
            return `
                <a href="/game/index.php?page=shop#item=${expedition.itemHash}&page=inventory">
                    <div class="${getExpeditionResultClass(expedition)}">
                        <img src="${imageUrl}" class="item-grade--${item.grade}" />
                    </div>
                </a>
            `;
        }

        case ExpeditionEventType.trader: {
            return `
                <div class="${getExpeditionResultClass(expedition)}">
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

function getExpeditionSizeIconClass(size: ExpeditionEventSize | ExpeditionEventCombatSize) {
    return 'ogame-tracker-expedition--size-icon mdi ' + (<Record<ExpeditionEventSize | ExpeditionEventCombatSize, string>>{
        [ExpeditionEventSize.small]: 'mdi-hexagon-slice-1',
        [ExpeditionEventSize.medium]: 'mdi-hexagon-slice-3',
        [ExpeditionEventSize.large]: 'mdi-hexagon-slice-5',
        'fled-death-star': 'mdi-run-fast',
    })[size];
}

function getExpeditionResultClass(expedition: ExpeditionEvent) {
    let cssClass = `ogame-tracker-expedition-result ogame-tracker-expedition-result--${expedition.type}`;

    if (expedition.type == ExpeditionEventType.fleet
        && ExpeditionFindableShipTypes.every(ship => (expedition.fleet[ship] ?? 0) > 0)
    ) {
        cssClass += ' ogame-tracker-expedition-result--fleet--rainbow';
    }

    if ('size' in expedition) {
        cssClass += ` ogame-tracker-expedition-result--size-${expedition.size}`;
    }

    return cssClass;
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
                .forEach(ship => {
                    totalExpeditionResult.ships[ship] ??= 0;
                    totalExpeditionResult.ships[ship] += (fleet[ship] ?? 0);
                });
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


//#region april fools
const aprilFools_expeditionIds = new Set<number>();
const aprilFools_lifeformDiscoveryIds = new Set<number>();

function isAprilFools(id: number, time: number) {
    const date = new Date(time);
    const now = new Date();

    return now.getDate() == 1 && now.getMonth() == 4 - 1
        && date.getHours() > id % 18;
}

function aprilFools_replaceMessage(messageType: MessageType, lang: LanguageKey, id: number, msg: Element, time: number) {
    if (isAprilFools(id, time) && lang == LanguageKey.de) {
        if (messageType == MessageType.TrackExpedition) {
            aprilFools_replaceExpeditionMessage(id, msg);
        } else if (messageType == MessageType.TrackLifeformDiscovery) {
            aprilFools_replaceLifeformDiscoveryMessage(id, msg);
        }
    }
}

function aprilFools_replaceExpeditionMessage(id: number, msg: Element) {
    const seededRand = id * 16807 % 2147483647;
    const rand = (min: number, max: number) => Math.floor(min + seededRand % (max - min));


    const replacements: Partial<Record<number, string>> = {
        1: `Unsere Expeditionsflotte ist auf eine Gruppe feindlicher Schiffe gestoßen. Damit wir unversehrt nach Hause fliegen konnten, mussten wir eine Gebühr zahlen.<br/><br/>Du musstest Dunkle Materie ${new Intl.NumberFormat('de').format(rand(12_612, 19_346))} abgeben.`,
        7: `Unsere Expeditionsflotte ist auf eine Gruppe feindlicher Schiffe gestoßen. Damit wir unversehrt nach Hause fliegen konnten, mussten wir eine Gebühr zahlen.<br/><br/>Du musstest Metall ${new Intl.NumberFormat('de').format(1_000_000 * 3 * rand(4, 16))} abgeben.`,
        11: `Unsere Expeditionsflotte ist auf eine Gruppe feindlicher Schiffe gestoßen. Damit wir unversehrt nach Hause fliegen konnten, mussten wir eine Gebühr zahlen.<br/><br/>Du musstest Kristall ${new Intl.NumberFormat('de').format(1_000_000 * 2 * rand(4, 16))} abgeben.`,
        15: `Unsere Expeditionsflotte ist auf eine Gruppe feindlicher Schiffe gestoßen. Damit wir unversehrt nach Hause fliegen konnten, mussten wir eine Gebühr zahlen.<br/><br/>Du musstest Deuterium ${new Intl.NumberFormat('de').format(1_000_000 * 1 * rand(4, 16))} abgeben.`,
        27: 'Unsere Expedition hat einen Händler auf dem Weg zu einem Kunden getroffen. Er handelt jedoch ausschließlich mit Gewürzen, weshalb er uns leider keine Rohstoffe zum Handel anbieten kann. Enttäuscht und ohne weitere Ereignisse unsere deine Expedition nach Hause.',
        36: 'In den Tiefen des Alls sind unsere Schiffe auf einen einsamen Mond getroffen, der anscheinend von der Umlaufbahn seines Planeten abgekommen war. Bei der Untersuchung des Mondes wurden ein zerstörtes Sprungtor sowie mehrere Hundert Millionen verlassene Schiffe entdeckt, welche sich jedoch alle als funktionsuntüchtig herausstellten. Der Kapitän fand außerdem an einigen Schiffen die Inschrift "scudi", allerdings konnte niemand etwas damit anfangen.',
        42: 'Deine Expedition fand einige verlassene Todessterne in der Nähe eines bewaldeten Mondes. Als die Techniker die Stationen betraten, aktivierten sich die Todessterne und zerstörten die gesamte Expeditionsflotte.',
        53: 'Inmitten eines belebten Sonnensystems stieß deine Expeditionsflotte auf einen Planeten, auf dem sich Tausende Kisten mit Metall befanden. Da der Planet nur relativ schwach beschützt war, landete deine Crew auf dem Planeten, um die Kisten nach Hause zu transportieren. Als sie sich den Kisten näherten, verschwanden sie jedoch, und an dessen Stelle befand sich nun eine vollständig ausgebaute Metallmine sowie mehrere Millionen Schlachtkreuzer. Seitdem fehlt von unserer Expeditionsflotte jede Spur.',
        69: 'Deine Expedition stieß auf einen kleinen Planeten, der vollkommen mit einem Dschungel überwachsen war. In den Tiefen des Dschungels fanden sie eine kleine Hütte, in der sich ein kleines und hässliches Wesen auffand, das einer Puppe ähnelte, sowie sein frosch-ähnliches Haustier, welches wild durch die Gegend hüpfte. Die Crew versuchte, mit dem Wesen zu kommunizieren, jedoch murmelte das Wesen nur unverständliche Worte vor sich hin, die sich wie "Wo Voice?" anhörten. Da sich auf dem Planeten sonst nichts befand, kehrt deine Expedition ohne Ergebnisse zurück.',
        76: `In der Nähe eines gelben Mondes erhielt der Kapitän eine Nachricht von einem Paketlieferdienst, dass ein Transporter in der Nähe sei, um Rohstoffe zu liefern. Die Nachricht besagte, dass die Expedition in der Nähe des gelben Mondes warten soll, da der Lieferant innerhalb der nächsten 30 Minuten eintreffen sollte. Nachdem die Expeditionsflotte deutlich länger gewartet hat, machte sie sich wieder auf den Weg nach Hause. Weit geflogen war sie jedoch noch nicht, als ein Schiff einen im All treibenden Schein des Lieferanten fand, auf dem stand, dass er die Flotte nicht angetroffen hätte und das Paket am nächsten Tag bei der Raumstation der Zustellfirma abholbar sein. Die Flotte machte sich also auf den Weg dorthin, muss aber noch eine Weile auf das Paket warten.<br/><br/>Die Rückkehr deiner Flotte verspätet sich um ${rand(15, 30)} Stunden.`,
        91: `Wir flogen durch ein System, das wohl vor kurzem durch einen sterbenden Stern zerstört wurde. Es trieben allerdings noch einige leuchtende Reste von dem einstigen Stern im All, aus denen wir Energie extrahieren konnten.<br><br>Es wurde Energie ${new Intl.NumberFormat('de').format(rand(1000, 160_000))} erbeutet.`,
    };
    const replacement = replacements[id % 99];
    if (replacement != null) {
        aprilFools_expeditionIds.add(id);

        let htmlReplacement = replacement;

        if (msg.innerHTML.includes('Logbuchnachtrag des Kommunikationsoffiziers:')) {
            const logbookReplacements = [
                'Ein Techniker glaubt, dass wir schon gestern hier waren. Wahrscheinlich sollten wir es besser in einer anderen Galaxie versuchen.',
                'Wir wissen zwar nicht, wie wir hierher gekommen sind, aber hier ist eine sehr stark beflogene intergalaktische Verkehrsstraße. Wir sollen mal ein Wörtchen mit dem Navigator reden.',
                'Wir sind einfach an einem riesigen Asteroiden aus Kristall vorbeigeflogen, weil der verdammte Kapitän der Meinung war, wir finden etwas besseres.',
                'Irgendwie sind die Expeditionen heute sehr ernüchternd, vielleicht sollten wir heute keine weitere Expeditionen mehr fliegen.',
                '&lt;<i>Der Text im Logbucheintrag ist unleserlich und daneben sind Rum-Flecken auf dem Interface.</i>&gt;'
            ];
            const logbookReplacement = logbookReplacements[id % logbookReplacements.length];
            htmlReplacement += `<br><br>Logbuchnachtrag des Kommunikationsoffiziers: ${logbookReplacement}`;

            msg.querySelector('.msgContent')!.innerHTML = htmlReplacement;
        }

        setTimeout(() => onMessage(<MessageTrackingErrorMessage>{
            type: MessageType.TrackingError,
            data: {
                id,
                type: 'expedition',
            },
            ogameMeta: getOgameMeta(),
            senderUuid: 'april-fools',
        }), 50 + Math.random() * 150);
    }
}
function aprilFools_replaceLifeformDiscoveryMessage(id: number, msg: Element) {
    const seededRand = id * 16807 % 2147483647;
    const rand = (min: number, max: number) => Math.floor(min + seededRand % (max - min));

    const msgContent = msg.querySelector('.msgContent')!;
    const isLifeformFound = msg.innerHTML.match(/wurde die Lebensform .+ gefunden/);
    let replaced = false;
    if (isLifeformFound != null) {
        const heimatplanet = msgContent.innerHTML.match(/Heimatplanet:\s*<a href=.+\]\s*<\/a><br><br>/)![0];
        const beiDenKoordinatenMatch = msgContent.innerHTML.match(/bei den Koordinaten\s*<a href=.+\]\s*<\/a> wurde die Lebensform (?<lifeform>.+) gefunden und der .+ hinzugefügt.<br><br>/i)!;
        const replacements: Partial<Record<number, { story: string, imageClass: string, lifeformDesc: string, name: string }>> = {
            3: {
                imageClass: 'lifeform5',
                name: 'Muh\'vi',
                story: `
                    Die Crew des Erkundungsschiffs landete auf einem Planeten, der der Erde sehr ähnlich sah. 
                    Dort fanden sie einige seltene Rohstoffe, die sie für die Produktion verschiedener Geräte abbauen wollten;
                    einige davon waren metallisch, aber ein besonderes Mineral stich hervor, weil es flüssig war und der Geruch einem Kuhfladen ähnelte.
                    Die Crew schaffte einige Geräte für den Abbau dieser Rohstoffe heran und begannen mit dem Abbau, als sie plötzlich ein 
                    lautes Plätschern hörten und hinter ihnen eine stinkende Lebensform aus dem Wasser kam.
                    Die Lebensform sagte der Crew, dass sie die Rohstoffe nicht abbauen sollten, da diese für den natürlichen Lebensraum der 
                    Flora und Fauna des Planeten dienten.
                    `,
                lifeformDesc: `
                    Die Muh'vi sind eine friedliche Lebensform, die vor allem Planeten mit großen Wassermengen bewohnt.
                    Ihre naturnahe Lebensart sorgt dafür, dass sie mit Flora und Fauna in Einklang leben, und diese
                    als solche beschützen und dafür sorgen. Diese Lebensweise sorgt auch dafür, dass sie sich gesund
                    ernähren und ihren Dung direkt als Dünger für die Pflanzen nutzen können. Sie sind sehr agil und
                    gleichzeitig sehr intelligent, weshalb sie sich auf Forschungen spezialisiert haben, die die Intelligenz
                    aller Lebensformen steigern und somit effektiver machen. <br/><br/>
                    Funktion: <br/>
                    Muh'vi sind auf die Verbesserung anderer Lebensformen spezialisiert, ihre Gebäude verringern die Forschungszeit
                    sowie erhöhen die Nahrungserträge für die Bevölkerung. Ihre Bevölkerung wächst explosiv, allerdings verbraucht sie
                    sehr viel Nahrung. Ihre höhere Intelligenz sorgt allerdings auch dafür, dass deutlich weniger Lebenformen zum Forschen
                    benötigt werden. Sie verstärken die Klassenboni aller Klassen.
                `,
            },
            6: {
                imageClass: 'lifeform6',
                name: 'Jooda',
                story: `
                    Als die Crew den Geburtstag des Kapitäns auf dem Sumpfplaneten feierte, hatten wohl alle etwas
                    zu viel getrunken, denn sie fanden ihre Schiffe nicht wieder. So irrten sie durch den Sumpf, der
                    mit einem dichten Dschungel gewachsen war, um die Schiffe zu finden. Nachdem sie bereits eine ganze
                    Weile unterwegs waren, trafen sie auf eine seltsame Hütte, in der sich ein altes, faltiges Wesen befand.
                    Das Wesen war freundlich, aber sprach sehr seltsam.
                    `,
                lifeformDesc: `
                    Mit über 350 Jahren können die Jooda sehr alt werden. Sie sind leben einen gemächlichen Lebensstil,
                    sind sehr gastfreundlich, aber können sehr kriegerisch sein.
                    Sie sind meist grünlich und relativ klein, und haben faltige Haut, die der Haut eines Elefanten ähnelt.
                    Die Jooda sind vor allem auf Nahrungsaufnahme spezialisiert und vermehren sich sehr langsam, dafür verfügen sie auch
                    über Jahrhunderte altes Wissen über Kriegstechnologien, die sonst keine Lebensform kennt.
                    <br/><br/>
                    Funktion:<br/>
                    Jooda sind auf die Nahrungsaufnahme sowie Kriegstechnologien spezialisiert.
                    Dadurch haben sie einen hohen Nahrungsverbrauch, während sie sich gleichzeitig nur sehr langsam vermehren.
                    Ihre Gebäude verstärken sowohl die Nahrungsproduktion als auch die Statistiken der Schiffe, 
                    während ihre Forschungen hauptsächlich spezielle Schiffswerte wie das <b>Rapidfire</b> verbessern.
                `,
            },
            11: {
                imageClass: 'lifeform7',
                name: 'Nebearla',
                story: `
                    Die Crews der Erkundungsschiffe flogen in einen dichten Weltraumnebel, aus dem sie seltsame Signale empfangen hatten.
                    Das darin befindliche Asteroidenfeld hatte aber wohl niemand vorher entdeckt, weshalb die Schiffe beinahe alle durch 
                    die Asteroiden zerstört wurden. Jedoch wurden die Schiffe alle stark beschädigt und daher strandeten sie auf einem
                    größeren Asteroiden. Da der Nebel hier besonders dicht war, verlor sich die Crew bei der Erkundung. In einem dunklen Moment
                    tauchten auf einmal seltsame leuchtende Kreaturen auf, die anscheinend zum Teil selbst aus dem Nebel bestanden.
                    `,
                lifeformDesc: `
                    Die nebeligen Kreaturen tragen den Namen Nebärla und leben hauptsächlich in Weltraumnebeln. Ihre übernatürlichen Fähigkeiten 
                    sorgen dafür, dass sie Kämpfe vermeiden können, aber auch gleichzeitig in der Lage sind, Transporter heimlich zu überfallen
                    und die Ladung zu stehlen.
                    <br/><br/>
                    Funktion:<br/>
                    Die Nebärla sind pazifistische Räuber, die wie Ninja Transporter überfallen können, um deren Ladung zu stehlen.
                    Sie sind die einzige Lebensform, die Schiffe auf Missionen vom Typ "Überfall" schicken können, um die Ladungen der Schiffe
                    anderer Spieler zu stehlen.
                `,
            },
            13: {
                imageClass: 'lifeform8',
                name: 'Quokkok',
                story: `
                    Das Erkundungsschiff musste nach einem Schaden an der Hülle auf einem riesigen Wasserplaneten zwischenlanden.
                    Während die Techniker das Schiff reparierten, zog sich der Rest der Crew die Tauchanzüge an und machte sich auf die Reise in
                    den riesigen Ozean. In der Nähe einer großen Spalte im Meeresboden fielen plötzlich alle elektronischen Systeme aus,
                    und die Crew fand sich in absoluter Dunkelheit wieder.
                    Während die Crew auskühlte, fühlten sie auf einmal mehrere Tentakel an den Tauchanzügen, was sie in eine Art Schreckstarre
                    versetzte. Die Lebensform war allerdings freundlich und brachte die Crew unversehrt zu ihrem Schiff zurück.
                    `,
                lifeformDesc: `
                    Die Quokkok sind nicht dafür bekannt, viele Worte mit fremden Lebewesen auszutauschen. Allein deswegen war es schon ein großes Ereignis,
                    dass sie Quokkok die Worte "Quok quuoquk quik quakqui quiok qurk" von sich gaben.
                    <br/><br/>
                    Funktion:<br/>
                    Quokkok sind Lebensformen, die gern die das Universum erkunden. Ihre Schiffe können daher einem Time-Warp-Antrieb ausgerüstet werden,
                    die Flugzeiten verkürzen, und sogar die Dauer von Expeditionen verringern können.
                `,
            },
            17: {
                imageClass: 'lifeform9',
                name: 'Racool',
                story: `
                    In einem riesigen Berg eines Eisplaneten fand die Crew Bauwerke, die denen von Zwergen aus altertümlichen Fabeln und Geschichten 
                    ähnlich sahen. Sie untersuchten die Bauwerke eine ganze Weile, als der Kapitän schließlich in der Nähe eine Art brodeln hörte. 
                    Die Crew machte sich auf den Weg dorthin, und fand sich in der Mitte einer Art Modenschau wieder. 
                    Dort wurden sie freundlich empfangen, musste aber aus Gastfreundschaft pinke Kleidung anziehen. Die Crewmitglieder nahmen am Festbankett 
                    teil und staunten über die bunten Farben und die besondere Fähigkeit dieser Lebensform, Feten zu feiern.
                    `,
                lifeformDesc: `
                    Die Racool sind eine Lebensform, die sich vor allem auf Fashion und moderne Look spezialisiert. Sie tragen gerne pinke Kleidung,
                    und gehen sogar so weit, dass sie einzelne Planeten und Monde in farbige Gewänder hüllen.
                    <br/><br/>
                    Funktion:<br/>
                    Die Racool haben keine eigenen Forschungen, dafür sind ihre Gebäude auf die Produktion von Dunkler Materie sowie Fashion spezialisiert.
                    Mit ihnen können die Farben und Formen der Planeten und Monde für alle Spieler verändert werden. Planeten können sogar vollständig versteckt werden,
                    dass andere Spieler diese nicht in der Galaxieansicht sehen können, diese Fähigkeit erfordert allerdings eine besonders hohe Energieproduktion.
                `,
            },
        };
        const replacement = replacements[id % 19];
        if (replacement != null) {
            aprilFools_lifeformDiscoveryIds.add(id);
            msgContent.innerHTML = heimatplanet
                + replacement.story
                + '<br/>'
                + beiDenKoordinatenMatch[0].replace(beiDenKoordinatenMatch.groups!.lifeform, replacement.name)
                + `
                    <div class="lifeformbox">
                        <div class="lifeform-item-icon ${replacement.imageClass}"></div>
                        ${replacement.lifeformDesc}
                    </div>`;
            replaced = true;
        }
    }
    else {
        const replacements: Partial<Record<number, string>> = {
            5: `Auf der Suche nach Lebensformen wurde das Erkundungsschiff von einiges Piraten als Geiseln entführt. Sie forderten ein Lösegeld, damit unsere Crew wieder unversehrt nach Hause fliegen kann, daher sahen wir uns gezwungen, auf die Forderungen der Piraten einzugehen.<br/><br/>Artefakte verloren: ${rand(55, 916)}`,
        };
        const replacement = replacements[id % 49];
        if (replacement != null) {
            aprilFools_lifeformDiscoveryIds.add(id);
            msgContent.innerHTML = replacement;
            replaced = true;
        }
    }

    if (replaced) {
        setTimeout(() => onMessage(<MessageTrackingErrorMessage>{
            type: MessageType.TrackingError,
            data: {
                id,
                type: 'lifeform-discovery',
            },
            ogameMeta: getOgameMeta(),
            senderUuid: 'april-fools',
        }), 50 + Math.random() * 150);
    }
}
//#endregion