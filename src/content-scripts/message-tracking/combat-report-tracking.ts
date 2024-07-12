import { parse } from "date-fns";
import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { Message, MessageOgameMeta } from "../../shared/messages/Message";
import { MessageType } from "../../shared/messages/MessageType";
import { CombatReportMessage, CombatReportUnknownMessage, RequestSingleCombatReportMessage, TrackCombatReportMessage } from "../../shared/messages/tracking/combat-reports";
import { OgameCombatReport } from "../../shared/models/ogame/combats/OgameCombatReport";
import { ResourceType } from "../../shared/models/ogame/resources/ResourceType";
import { dateTimeFormat } from "../../shared/ogame-web/constants";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { _logDebug, _logWarning } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { addOrSetCustomMessageContent, cssClasses, formatNumber } from "./utils";
import { ogameMetasEqual } from '../../shared/ogame-web/ogameMetasEqual';
import { sendMessage } from "@/shared/communication/sendMessage";
import { CombatReport } from "@/shared/models/combat-reports/CombatReport";
import { messageTrackingUuid } from "@/shared/uuid";
import { MessageTrackingErrorMessage, WillNotBeTrackedMessage } from "@/shared/messages/tracking/misc";
import { v4 } from "uuid";
import { CombatTrackingNotificationMessage, CombatTrackingNotificationMessageData, MessageTrackingErrorNotificationMessage, NotificationType } from "@/shared/messages/notifications";
import { TryActionResult } from "@/shared/TryActionResult";
import { OgameRawMessageType } from "@/shared/models/ogame/messages/OgameRawMessageType";
import { getMessageAttributes } from "@/shared/utils/getMessageAttributes";
import { parseIntSafe } from "@/shared/utils/parseNumbers";
import { createRecord } from "@/shared/utils/createRecord";
import { ShipTypes } from "@/shared/models/ogame/ships/ShipTypes";
import { ShipType } from "@/shared/models/ogame/ships/ShipType";
import { PlanetType } from "@/shared/models/ogame/common/PlanetType";

const domParser = new DOMParser();
const combatJsonRegex = /var combatData = jQuery\.parseJSON\('(?<json>[^\n]+)'\);/;

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

const maxRetries = 5;
const retryCombats: { id: number; date: number; attempt: number; msg: Element }[] = [];

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

            const li = document.querySelector(`.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find combat report with id '${msg.data.id}'`);
            li.classList.add(cssClasses.messages.combatReport);
            li.classList.add(cssClasses.messages.processed);
            li.classList.add(cssClasses.messages.ignored);

            li.classList.remove(cssClasses.messages.waitingToBeProcessed);
            addOrSetCustomMessageContent(li, false);

            delete waitingForCombats[msg.data.id];
            break;
        }

        case MessageType.CombatReport:
        case MessageType.NewCombatReport: {
            const msg = message as CombatReportMessage;
            const combatReport = msg.data;

            shouldTrackResolvers[combatReport.id]?.(false);
            delete shouldTrackResolvers[combatReport.id];

            const li = document.querySelector(`.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find combat report with id '${msg.data.id}'`);
            li.classList.add(cssClasses.messages.combatReport);

            li.classList.remove(cssClasses.messages.waitingToBeProcessed);
            li.classList.add(cssClasses.messages.processed);

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
            addOrSetCustomMessageContent(li, outerHtml);

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

            const li = document.querySelector(`.msg[data-msg-id="${id}"]`) ?? _throw(`failed to find combat report message with id '${id}'`);

            li.classList.remove(cssClasses.messages.waitingToBeProcessed);
            li.classList.add(cssClasses.messages.error);
            addOrSetCustomMessageContent(li, false);

            delete waitingForCombats[id];
            failedToTrackCombats[id] = true;
            sendNotificationMessages();
            break;
        }
    }
}

export const combatTracking = {
    onMessage,
    messageType: OgameRawMessageType.combatReport,
    track: trackCombatReports,
    onInit: () => retryLoadCombats(),
}

async function trackCombatReports(msgs: Element[]) {
    const messages = msgs.filter(elem => elem.querySelector('.msg_actions a.txt_link') != null); // ignore combat reports of intergalactic missiles or 1-round combats without proper report

    // add base css class to prevent multiple loads of the same combat report 
    messages.forEach(msg => msg.classList.add(cssClasses.messages.base));

    const ogameMeta = getOgameMeta();
    const promises = messages.map(async msg => await loadCombatReport(msg, ogameMeta));

    await Promise.all(promises);
}

async function loadCombatReport(msg: Element, ogameMeta: MessageOgameMeta, attempt?: number): Promise<void> {
    const id = parseInt(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id')); // no parseSafe because we want to error in the try-catch block

    try {
        // prepare message to service worker
        if (isNaN(id)) {
            _throw('Message id is NaN');
        }

        const shouldTrack = await shouldTrackCombatReport(id, ogameMeta);
        if (!shouldTrack) {
            return;
        }

        // mark message as "waiting for result"
        msg.classList.add(cssClasses.messages.waitingToBeProcessed);
        addOrSetCustomMessageContent(msg, `<div class="ogame-tracker-loader"></div>`);
        
        const element = msg.querySelector('.rawMessageData') ?? _throw(`Cannot find rawMessageData element`);
        const { timestamp: date } = getMessageAttributes(element, {
            timestamp: {
                optional: false,
                conversion: value => parseIntSafe(value, 10) * 1000, 
            },
        }); 

        if (isNaN(date)) {
            _throw('Message timestamp is NaN');
        }

        const ogameCombatReport = parseCombatReportData(element);

        // skip if is expedition fight and the language is not supported
        if (ogameCombatReport.isExpedition && !isSupportedLanguage(ogameMeta.userLanguage)) {
            addOrSetCustomMessageContent(msg, `<span class="mdi mdi-alert" style="font-size: 24px;"></span>`);
            return;
        }

        // send message to service worker
        const workerMessage: TrackCombatReportMessage = {
            type: MessageType.TrackCombatReport,
            ogameMeta,
            data: {
                id,
                date,
                ogameCombatReport,
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

function parseCombatReportData(element: Element): OgameCombatReport { 
    const { playerId } = getOgameMeta();

    const { 
        defenderspaceobject: rawDefenderInfo,
        combatrounds: rawCombatRounds,
        result: rawResult,
        fleets: rawFleets,
     } = getMessageAttributes(element, {
        defenderspaceobject: {
            optional: false,
            conversion: json => JSON.parse(json), 
        },
        result: {
            optional: false,
            conversion: json => JSON.parse(json), 
        },
        combatrounds: {
            optional: false,
            conversion: json => JSON.parse(json), 
        },
        fleets: {
            optional: false,
            conversion: json => JSON.parse(json), 
        },
    }); 

    const playerFleets = rawFleets.filter((f: any) => f.player?.id == playerId);
    const lastCombatRound = rawCombatRounds[rawCombatRounds.length - 1] ?? { fleets: [] };

    const playerFleetIds = playerFleets.map((f: any) => f.fleetId);
    const playerLossesPerFleet: Record<ShipType, number>[] = lastCombatRound.fleets
        .filter((f: any) => playerFleetIds.includes(f.fleetId))
        .map((f: any) => createRecord(ShipTypes, (ship: ShipType) => f.technologies.find((t: any) => t.technologyId == ship)?.destroyedTotal ?? 0));

    const playerLosses = createRecord(ShipTypes, ship => {
        return playerLossesPerFleet
            .map(fleet => fleet[ship])
            .reduce((acc, cur) => acc + cur, 0);
    });

    const isEspionageCombat = rawFleets
        .filter((f: any) => f.side == 'attacker')
        .every((f: any) => f.combatTechnologies.every((t: any) => t.technologyId == ShipType.espionageProbe));

    return {
        winner: rawResult.winner,
        isOwner: rawDefenderInfo.owner?.id == playerId,
        coordinates: {
            ...rawDefenderInfo.coordinates,
            type: rawDefenderInfo.type == 'planet' ? PlanetType.planet : PlanetType.moon,
        },
        isExpedition: rawDefenderInfo.coordinates.position == 16,

        isEspionageCombat,

        isAttacker: playerFleets.some((f: any) => f.side == 'attacker'),
        isDefender: playerFleets.some((f: any) => f.side == 'defender'),

        loot: {
            metal: rawResult.loot.resources.find((r: any) => r.resource == 'metal')?.amount ?? 0,
            crystal: rawResult.loot.resources.find((r: any) => r.resource == 'crystal')?.amount ?? 0,
            deuterium: rawResult.loot.resources.find((r: any) => r.resource == 'deuterium')?.amount ?? 0,
        },

        debris: {
            metal: rawResult.debris.resources.find((r: any) => r.resource == 'metal')?.amount ?? 0,
            crystal: rawResult.debris.resources.find((r: any) => r.resource == 'crystal')?.amount ?? 0,
            deuterium: rawResult.debris.resources.find((r: any) => r.resource == 'deuterium')?.amount ?? 0,
        },

        playerLosses,
    };
}

function getRetryTime(attempt: number) {
    return Date.now() + (2 ** (attempt - 1)) * 1_000;
}

async function retryLoadCombats() {
    const now = Date.now();

    const retries = retryCombats.filter(r => r.date <= now);
    retries.forEach(r => retryCombats.splice(retryCombats.indexOf(r), 1));

    const ogameMeta = getOgameMeta();
    const promises = retries.map(async retry => {
        await loadCombatReport(retry.msg, ogameMeta, retry.attempt);
    });

    await Promise.all(promises);

    setTimeout(async () => await retryLoadCombats(), 500);
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

async function loadOgameCombatReport(url: string): Promise<TryActionResult<OgameCombatReport>> {
    const response = await fetch(url, { 
        method: 'GET',
        redirect: 'error',
    });
    if (!response.ok) {
        return { success: false };
    }

    const html = await response.text();

    const doc = domParser.parseFromString(html, 'text/html');
    const scripts = doc.querySelectorAll('script');
    const combatScript = Array.from(scripts).find(script => (script.textContent ?? '').includes('var combatData =')) ?? _throw(`cannot find ogame combat data ('${url}')`);

    const combatJsonMatch = combatScript.textContent?.match(combatJsonRegex) ?? _throw('no combat json match');
    const combatJson = combatJsonMatch.groups?.json ?? _throw('had combat json match but without content');

    return {
        success: true,
        result: JSON.parse(combatJson) as OgameCombatReport,
    };
}


function updateCombatResults(msg: CombatReportMessage) {
    delete waitingForCombats[msg.data.id];
    combatTrackingResult.count++;

    const resources = msg.data.loot;
    [ResourceType.metal, ResourceType.crystal, ResourceType.deuterium]
        .forEach(resource => combatTrackingResult.resources[resource] += resources[resource]);

    sendNotificationMessages();
}
