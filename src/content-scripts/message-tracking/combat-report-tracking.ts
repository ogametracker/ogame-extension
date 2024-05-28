import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { Message, MessageOgameMeta } from "../../shared/messages/Message";
import { MessageType } from "../../shared/messages/MessageType";
import { CombatReportMessage, CombatReportUnknownMessage, RequestSingleCombatReportMessage, TrackCombatReportMessage } from "../../shared/messages/tracking/combat-reports";
import { ResourceType } from "../../shared/models/ogame/resources/ResourceType";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { _logDebug, _logError, _logWarning } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { getMessageAttributes } from "../../shared/utils/getMessageAttributes";
import { addOrSetCustomMessageContent, cssClasses, formatNumber, tabIds } from "./utils";
import { ogameMetasEqual } from '../../shared/ogame-web/ogameMetasEqual';
import { sendMessage } from "@/shared/communication/sendMessage";
import { CombatReport } from "@/shared/models/combat-reports/CombatReport";
import { messageTrackingUuid } from "@/shared/uuid";
import { MessageTrackingErrorMessage, WillNotBeTrackedMessage } from "@/shared/messages/tracking/misc";
import { v4 } from "uuid";
import { CombatTrackingNotificationMessage, CombatTrackingNotificationMessageData, MessageTrackingErrorNotificationMessage, NotificationType } from "@/shared/messages/notifications";
import { parseIntSafe } from "@/shared/utils/parseNumbers";
import { OgameCombatReport, OgameCombatResult, Player } from '../../shared/models/ogame/combats/OgameCombatReport';

let tabContent: Element | null = null;

const notificationIds = {
    result: v4(),
    error: v4(),
};
const waitingForCombats: Record<number, true> = {};

const failedToTrackCombats: Record<number, true> = {};
const combatTrackingResult: CombatTrackingNotificationMessageData = {
    count: 0,
    resources: {
        metal: 0,
        crystal: 0,
        deuterium: 0,
    },
};
const shouldTrackResolvers: Record<number, (value: boolean) => void> = {};

export function initCombatReportTracking() { 
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
    const tabContentElement = tabContent ?? _throw('Cannot find messages holder element of combat report messages');

    const observer = new MutationObserver(async () => await trackCombatReports(tabContentElement));
    observer.observe(tabContentElement, { childList: true, subtree: true });
}

function sendNotificationMessages() {
    const failed = Object.keys(failedToTrackCombats).length;
    if (failed > 0) {
        sendErrorNotificationMessage(failed);
    }

    if (combatTrackingResult.count == 0) {
        return;
    }

    const msg: CombatTrackingNotificationMessage = {
        type: MessageType.Notification,
        ogameMeta: getOgameMeta(),
        senderUuid: messageTrackingUuid,
        data: {
            type: NotificationType.CombatTracking,
            messageId: notificationIds.result,
            ...combatTrackingResult,
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

function onMessage(message: Message<MessageType, any>) {
    const ogameMeta = getOgameMeta();
    if (!ogameMetasEqual(ogameMeta, message.ogameMeta)) {
        return;
    }

    switch (message.type) {
        case MessageType.CombatReportUnknown: {
            const { data: id } = message as CombatReportUnknownMessage;
            shouldTrackResolvers[id]?.(true);
            delete shouldTrackResolvers[id];
            break;
        }

        case MessageType.WillNotBeTracked: {
            const msg = message as WillNotBeTrackedMessage;
            if (msg.data.type != 'combat-report') {
                break;
            }
            shouldTrackResolvers[msg.data.id]?.(false);
            delete shouldTrackResolvers[msg.data.id];

            const div = document.querySelector(`div.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find combat report with id '${msg.data.id}'`);
            div.classList.add(cssClasses.messages.combatReport);
            div.classList.add(cssClasses.messages.processed);
            div.classList.add(cssClasses.messages.ignored);

            div.classList.remove(cssClasses.messages.waitingToBeProcessed);
            addOrSetCustomMessageContent(div, false);

            delete waitingForCombats[msg.data.id];
            break;
        }

        case MessageType.CombatReport:
        case MessageType.NewCombatReport: {
            const msg = message as CombatReportMessage;
            const combatReport = msg.data;

            shouldTrackResolvers[combatReport.id]?.(false);
            delete shouldTrackResolvers[combatReport.id];

            const div = document.querySelector(`div.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find combat report with id '${msg.data.id}'`);
            div.classList.add(cssClasses.messages.combatReport);

            div.classList.remove(cssClasses.messages.waitingToBeProcessed);
            div.classList.add(cssClasses.messages.processed);

            let html = '';

            if (Object.values(combatReport.loot).some(amount => amount != 0)) {
                html = `
                    <div class="ogame-tracker-combat-report--loot-table">
                        ${[ResourceType.metal, ResourceType.crystal, ResourceType.deuterium].map(resource => `
                            <div class="ogame-tracker-resource ${resource}"></div>
                            <div class="${combatReport.loot[resource] < 0
/*                              */ ? 'ogame-tracker-combat-report--negative-loot'
/*                              */ : combatReport.loot[resource] == 0
/*                                  */ ? 'ogame-tracker-combat-report--no-loot'
/*                                  */ : ''
/*                          */}">
                                ${formatNumber(combatReport.loot[resource])}
                            </div>
                        `).join('')}
                    </div>`;
            }
            if (combatReport.debrisField.metal > 0 || combatReport.debrisField.crystal > 0) {
                html += `
                    <div class="ogame-tracker-combat-report--debris-field-table">
                        <span class="ogti ogti-debris-field"></span>
                        ${([ResourceType.metal, ResourceType.crystal, ResourceType.deuterium] as (keyof CombatReport['debrisField'])[]).map(resource => `
                            <div class="ogame-tracker-resource ${resource}"></div>
                            <div class="${(combatReport.debrisField[resource] ?? 0) == 0
/*                              */ ? 'ogame-tracker-combat-report--no-loot'
/*                              */ : ''
/*                          */}">
                                ${formatNumber(combatReport.debrisField[resource] ?? 0)}
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            const outerHtml = `<div class="ogame-tracker-combat-report">${html == '' ? '-' : html}</div>`;
            addOrSetCustomMessageContent(div, outerHtml);

            if (message.type == MessageType.NewCombatReport) {
                updateCombatResults(msg);
            }
            break;
        }

        case MessageType.TrackingError: {
            const { type, id } = (message as MessageTrackingErrorMessage).data;
            if (type != 'combat-report') {
                break;
            }

            const div = document.querySelector(`div.msg[data-msg-id="${id}"]`) ?? _throw(`failed to find combat report message with id '${id}'`);

            div.classList.remove(cssClasses.messages.waitingToBeProcessed);
            div.classList.add(cssClasses.messages.error);
            addOrSetCustomMessageContent(div, false);

            delete waitingForCombats[id];
            failedToTrackCombats[id] = true;
            sendNotificationMessages();
            break;
        }
    }
}

async function trackCombatReports(elem: Element) {
    const combatsTab = document.querySelector(`.tabsWrapper .innerTabItem.active[data-subtab-id="${tabIds.combats}"]`);
    if (combatsTab == null) {
        return
    }

    const messages = Array.from(elem.querySelectorAll('div.msg[data-msg-id]'))
        .filter(elem => !elem.classList.contains(cssClasses.messages.base))
        .filter(elem => elem.querySelector('.msg_actions a.txt_link') != null) // ignore combat reports of intergalactic missiles or 1-round combats without proper report
        .filter(elem => {
            const messageType = elem.querySelector('.rawMessageData')?.getAttribute('data-raw-messagetype');
            return messageType === "25"
        });

    // add base css class to prevent multiple loads of the same combat report 
    messages.forEach(msg => msg.classList.add(cssClasses.messages.base));

    const ogameMeta = getOgameMeta();
    const promises = messages.map(async msg => await loadCombatReport(msg, ogameMeta));

    await Promise.all(promises);
}

async function loadCombatReport(msg: Element, ogameMeta: MessageOgameMeta): Promise<void> {
    const id = parseInt(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id')); // no parseSafe because we want to error in the try-catch block

    try {
        // prepare message to service worker
        const shouldTrack = await shouldTrackCombatReport(id, ogameMeta);
            if (!shouldTrack) {
                return;
            }

            const element = msg.querySelector('.rawMessageData') ?? _throw(`Cannot find rawMessageData element`); 
            const attributes = getMessageAttributes(element);  
            _logDebug(attributes);

            const timestamp = attributes["timestamp"] ?? _throw('Cannot find message timestamp'); 
            const resultString = attributes["result"] ?? _throw('Cannot find message result');
            const coords = attributes["coords"] ?? _throw('Cannot find message coordinates');
            const combatRounds = attributes["combatrounds"] ?? _throw('Cannot find message combatrounds');
            const playersString = attributes["fleets"] ?? _throw('Cannot find message fleets');
                    
            const date = parseInt(timestamp, 10) * 1000;
            if (isNaN(date)) {
                _throw('Message timestamp is NaN');
            }

            msg.classList.add( 
                cssClasses.messages.base, 
                cssClasses.messages.waitingToBeProcessed, 
            ); 
            addOrSetCustomMessageContent(msg, `<div class="ogame-tracker-loader"></div>`);

            //skip if is expedition fight and the language is not supported
            const isExpeditionCombatReport = coords.endsWith(':16'); 
            if (isExpeditionCombatReport && !isSupportedLanguage(ogameMeta.userLanguage)) {
                addOrSetCustomMessageContent(msg, `<span class="mdi mdi-alert" style="font-size: 24px;"></span>`);
                return;
            }

            const result = JSON.parse(resultString);
            const simplifiedResult: OgameCombatResult = {
                winner: result.winner,
                loot: {
                    metal: result.loot.resources.find((r: any) => r.resource === "metal").amount || 0,
                    crystal: result.loot.resources.find((r: any) => r.resource === "crystal").amount || 0,
                    deuterium: result.loot.resources.find((r: any) => r.resource === "deuterium").amount || 0
                },
                debris: {
                    metal: result.debris.resources.find((r: any) => r.resource === "metal")?.remaining || 0,
                    crystal: result.debris.resources.find((r: any) => r.resource === "crystal")?.remaining || 0,
                    deuterium: result.debris.resources.find((r: any) => r.resource === "deuterium")?.remaining || 0
                },
            };

            const players = JSON.parse(playersString);
            const simplifiedPlayers: Player[] = [];
            players.forEach((player: any) => {
                simplifiedPlayers.push({
                    side: player.side,
                    fleetId: player.fleetId,
                    player: {
                        type: player.player.type,
                        id: player.player.id,
                        name: player.player.name
                    }
                });
            });


            const ogameCombatReport: OgameCombatReport = {
                coords: coords,
                players: simplifiedPlayers,
                combatRounds: JSON.parse(combatRounds),
                result: simplifiedResult,
                isExpedition: isExpeditionCombatReport,
            };

            // send message to service worker
            const workerMessage: TrackCombatReportMessage = {
                type: MessageType.TrackCombatReport,
                ogameMeta,
                data: {
                    id,
                    date,
                    ogameCombatReport
                },
                senderUuid: messageTrackingUuid,
            };
            sendMessage(workerMessage);

            waitingForCombats[id] = true;
    }
    catch (error) {
        console.error(error);
    
        msg.classList.add(cssClasses.messages.base, cssClasses.messages.error);
        addOrSetCustomMessageContent(msg, false);
    
        delete waitingForCombats[id];
        failedToTrackCombats[id] = true;
        sendNotificationMessages();
    }
}

function shouldTrackCombatReport(id: number, ogameMeta: MessageOgameMeta) {
    return new Promise<boolean>(resolve => {
        shouldTrackResolvers[id] = resolve;

        const workerMessage: RequestSingleCombatReportMessage = {
            type: MessageType.RequestSingleCombatReport,
            ogameMeta,
            data: id,
            senderUuid: messageTrackingUuid,
        };
        sendMessage(workerMessage);
    });
}

function updateCombatResults(msg: CombatReportMessage) {
    delete waitingForCombats[msg.data.id];
    combatTrackingResult.count++;

    const resources = msg.data.loot;
    [ResourceType.metal, ResourceType.crystal, ResourceType.deuterium]
        .forEach(resource => combatTrackingResult.resources[resource] += resources[resource]);

    sendNotificationMessages();
}
