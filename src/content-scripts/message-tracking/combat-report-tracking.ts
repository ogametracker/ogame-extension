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
import { addOrSetCustomMessageContent, cssClasses, formatNumber, tabIds } from "./utils";
import { ogameMetasEqual } from '../../shared/ogame-web/ogameMetasEqual';
import { sendMessage } from "@/shared/communication/sendMessage";
import { CombatReport } from "@/shared/models/combat-reports/CombatReport";
import { messageTrackingUuid } from "@/shared/uuid";
import { MessageTrackingErrorMessage, WillNotBeTrackedMessage } from "@/shared/messages/tracking/misc";
import { v4 } from "uuid";
import { CombatTrackingNotificationMessage, CombatTrackingNotificationMessageData, MessageTrackingErrorNotificationMessage, NotificationType } from "@/shared/messages/notifications";
import { TryActionResult } from "@/shared/TryActionResult";

const domParser = new DOMParser();
const combatJsonRegex = /var combatData = jQuery\.parseJSON\('(?<json>[^\n]+)'\);/;

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

const maxRetries = 5;
const retryCombats: { id: number; date: number; attempt: number; msg: Element }[] = [];

export function initCombatReportTracking() {
    chrome.runtime.onMessage.addListener(message => onMessage(message));

    const contentElem = document.querySelector('#content .content') ?? _throw('Cannot find content element');
    const initObserver = new MutationObserver(() => {
        if (tabContent?.isConnected != true) {
            setupObserver();
        }
    });
    initObserver.observe(contentElem, { subtree: true, childList: true });

    retryLoadCombats();
}

function setupObserver() {
    const tabLabel = document.querySelector(`[id^="subtabs-"][data-tabid="${tabIds.combats}"]`) ?? _throw('Cannot find label of combat report messages');
    const tabContentId = tabLabel.getAttribute('aria-controls') ?? _throw('Cannot find id of combat report messages tab content');
    tabContent = document.querySelector(`#${tabContentId}`);
    const tabContentElem = tabContent ?? _throw('Cannot find content element of combat report messages');

    const observer = new MutationObserver(async () => await trackCombatReports(tabContentElem));
    observer.observe(tabContentElem, { childList: true, subtree: true });
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

            const li = document.querySelector(`li.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find combat report with id '${msg.data.id}'`);
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

            const li = document.querySelector(`li.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find combat report with id '${msg.data.id}'`);
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

            const li = document.querySelector(`li.msg[data-msg-id="${id}"]`) ?? _throw(`failed to find combat report message with id '${id}'`);

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

async function trackCombatReports(elem: Element) {
    const messages = Array.from(elem.querySelectorAll('li.msg[data-msg-id]'))
        .filter(elem => !elem.classList.contains(cssClasses.messages.base))
        .filter(elem => elem.querySelector('.msg_actions a.txt_link') != null); // ignore combat reports of intergalactic missiles or 1-round combats without proper report

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

        const dateText = msg.querySelector('.msg_head .msg_date')?.textContent ?? _throw('Cannot find message date');
        const date = parse(dateText, dateTimeFormat, new Date()).getTime();
        if (isNaN(date)) {
            _throw('Message date is NaN');
        }

        // mark message as "waiting for result"
        msg.classList.add(cssClasses.messages.waitingToBeProcessed);
        addOrSetCustomMessageContent(msg, `<div class="ogame-tracker-loader"></div>`);

        const messageUrl = `/game/index.php?page=messages&ajax=1&tabid=${tabIds.combats}&messageId=${id}`;
        const loadingCombatResult = await loadOgameCombatReport(messageUrl);

        // ogame error (e.g. 503) with valid response
        if (!loadingCombatResult.success) {
            const newAttempt = (attempt ?? 0) + 1;
            if(newAttempt > maxRetries) {
                _throw(`failed to load combat report ${id} after ${maxRetries} retries`);
            }

            _logWarning(`failed to load combat report ${id}, retrying (attempt ${newAttempt})`);
            retryCombats.push({
                id,
                attempt: newAttempt,
                date: getRetryTime(newAttempt),
                msg,
            });
            return;
        }

        const ogameCombatReport = loadingCombatResult.result;

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
    const response = await fetch(url, { method: 'GET' });
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
