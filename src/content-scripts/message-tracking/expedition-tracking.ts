import { Message } from "../../shared/messages/Message";
import { MessageType } from "../../shared/messages/MessageType";
import { ExpeditionMessage, TrackExpeditionMessage } from "../../shared/messages/tracking/expeditions";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { _log, _logDebug, _logWarning, _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { getMessageAttributes } from "../../shared/utils/getMessageAttributes";
import { cssClasses, addOrSetCustomMessageContent, formatNumber } from "./utils";
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
import { OgameRawMessageType } from "@/shared/models/ogame/messages/OgameRawMessageType";
import { parseCoordinates } from "@/shared/utils/parseCoordinates";
import { OgameRawExpeditionResultType } from "@/shared/models/ogame/messages/OgameRawExpeditionResultType";
import { OgameRawExpeditionSize } from "@/shared/models/ogame/messages/OgameRawExpeditionSize";
import { OgameRawExpeditionDepletionLevel } from "@/shared/models/ogame/messages/OgameRawExpeditionDepletionLevel";
import { ItemHash } from "@/shared/models/ogame/items/ItemHash";
import { createRecord } from "@/shared/utils/createRecord";

const errorId = v4();
const expeditionNotificationIds = {
    result: v4(),
    lostFleet: v4(),
};

const waitingForMessageResult: Record<number, true> = {};
const failedToTrackMessages: Record<number, true> = {};
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
        [ExpeditionEventType.combat]: 0,
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
    const unprocessedMessages = trackExpeditions(messages);

    unprocessedMessages.forEach(msg => {
        const id = parseIntSafe(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id'), 10);

        msg.classList.add(cssClasses.messages.base, cssClasses.messages.error);
        addOrSetCustomMessageContent(msg, false);

        delete waitingForMessageResult[id];
        failedToTrackMessages[id] = true;
        sendNotificationMessages();
    });
}

export const expeditionTracking = {
    onMessage,
    track: trackMessages,
    messageType: OgameRawMessageType.expedition,
};

function trackExpeditions(messages: Element[]) {
    const unprocessedMessages: Element[] = [];

    messages.forEach(msg => {
        const id = parseIntSafe(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id'), 10);

        try {
            // send message to service worker 
            const element = msg.querySelector('.rawMessageData') ?? _throw(`Cannot find rawMessageData element`); 

            const {
                timestamp: date,
                coords,
                expeditionresult: rawType,
                depletion: rawDepletion,
                size: rawSize,
                resourcesgained: rawResources,
                technologiesgained: rawShips,
                itemsgained: rawItems,
                navigation: rawNavigation,
            } = getMessageAttributes(element, {
                timestamp: {
                    optional: false,
                    conversion: value => parseIntSafe(value, 10) * 1000,
                },
                coords: {
                    optional: false,
                    conversion: value => parseCoordinates(value),
                },
                expeditionresult: {
                    optional: false,
                    conversion: value => value as OgameRawExpeditionResultType,
                },
                depletion: {
                    optional: true,
                    conversion: value => parseIntSafe(value) as OgameRawExpeditionDepletionLevel,
                },
                size: {
                    optional: true,
                    conversion: value => parseIntSafe(value) as OgameRawExpeditionSize,
                },
                resourcesgained: {
                    optional: true,
                    conversion: json => JSON.parse(json) as Partial<Record<'metal' | 'crystal' | 'deuterium' | 'darkMatter', number>>,
                },
                technologiesgained: {
                    optional: true,
                    conversion: json => JSON.parse(json) as Partial<Record<ExpeditionFindableShipType, { name: string; amount: number }>>,
                },
                navigation: {
                    optional: true,
                    conversion: json => JSON.parse(json) as Record<'returnTimeAbsoluteIncreaseHours' | 'returnTimeMultiplier', number>,
                },
                itemsgained: {
                    optional: true,
                    conversion: json => JSON.parse(json) as { id: ItemHash; amount: number; name: string }[],
                },
            });

            if (isNaN(date)) {
                _throw('Message timestamp is NaN');
            }

            const workerMessage: TrackExpeditionMessage = {
                type: MessageType.TrackExpedition,
                ogameMeta: getOgameMeta(),
                data: {
                    id,
                    date,
                    coordinates: coords,
                    type: rawType,
                    size: rawSize,
                    depletion: rawDepletion,
                    darkMatter: rawResources?.darkMatter,
                    resources: rawResources,
                    ships: createRecord(ExpeditionFindableShipTypes, ship => rawShips?.[ship]?.amount ?? 0),
                    item: rawItems?.[0].id,
                    navigationType: rawNavigation == null
                        ? undefined
                        : rawNavigation?.returnTimeMultiplier == 1 
                            ? 'delay'
                            : 'early',
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
                    ${
                        expedition.size != null 
                        ? `<div class="${getExpeditionSizeIconClass(expedition.size)}"></div>` 
                        : ''
                    }
                    <div class="mdi mdi-clock-outline"></div>
                </div>
            `;
        }

        case ExpeditionEventType.early: {
            return `
                <div class="${getExpeditionResultClass(expedition)}">
                    ${
                        expedition.size != null 
                        ? `<div class="${getExpeditionSizeIconClass(expedition.size)}"></div>` 
                        : ''
                    }
                    <div class="mdi mdi-clock-fast"></div>
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

        case ExpeditionEventType.combat: {
            return `
                <div class="${getExpeditionResultClass(expedition)}">
                    <div class="${getExpeditionSizeIconClass(expedition.size)}"></div>
                    <div class="mdi mdi-sword-cross"></div>
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
