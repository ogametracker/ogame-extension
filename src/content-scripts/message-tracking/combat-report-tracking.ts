import { parse } from "date-fns";
import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { Message } from "../../shared/messages/Message";
import { MessageType } from "../../shared/messages/MessageType";
import { CombatReportMessage, TrackCombatReportMessage } from "../../shared/messages/tracking/combat-reports";
import { OgameCombatReport } from "../../shared/models/ogame/combats/OgameCombatReport";
import { ResourceType } from "../../shared/models/ogame/resources/ResourceType";
import { dateTimeFormat } from "../../shared/ogame-web/constants";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { _logDebug } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { addOrSetCustomMessageContent, cssClasses, formatNumber, tabIds } from "./utils";
import { ogameMetasEqual } from '../../shared/ogame-web/ogameMetasEqual';
import { parseIntSafe } from "../../shared/utils/parseNumbers";

const domParser = new DOMParser();
const combatJsonRegex = /var combatData = jQuery.parseJSON\('(?<json>[^']+)'\);/;

let tabContent: Element | null = null;

export function initCombatReportTracking() {
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
    const tabLabel = document.querySelector(`[id^="subtabs-"][data-tabid="${tabIds.combats}"]`) ?? _throw('Cannot find label of combat report messages');
    const tabContentId = tabLabel.getAttribute('aria-controls') ?? _throw('Cannot find id of combat report messages tab content');
    tabContent = document.querySelector(`#${tabContentId}`);
    const tabContentElem = tabContent ?? _throw('Cannot find content element of combat report messages');

    const observer = new MutationObserver(async () => await trackCombatReports(tabContentElem));
    observer.observe(tabContentElem, { childList: true, subtree: true });
}

function onMessage(message: Message<MessageType, any>) {
    const ogameMeta = getOgameMeta();
    if(!ogameMetasEqual(ogameMeta, message.ogameMeta)) {
        return;
    }

    switch (message.type) {
        case MessageType.CombatReport:
        case MessageType.NewCombatReport: {
            const msg = message as CombatReportMessage;
            const combatReport = msg.data;

            const li = document.querySelector(`li.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find combat report with id '${msg.data.id}'`);
            li.classList.add(cssClasses.messages.combatReport);

            li.classList.remove(cssClasses.messages.waitingToBeProcessed);
            li.classList.add(cssClasses.messages.processed);

            if (Object.values(combatReport.loot).some(amount => amount != 0)) {
                addOrSetCustomMessageContent(li, `
                    <div class="ogame-tracker-combat-report">
                        <div class="ogame-tracker-combat-report--loot-table">
                            ${Object.values(ResourceType).map(resource => `
                                <div class="ogame-tracker-resource ${resource}"></div>
                                <div class="${combatReport.loot[resource] < 0
/*                                  */ ? 'ogame-tracker-combat-report--negative-loot'
/*                                  */ : combatReport.loot[resource] == 0
/*                                      */ ? 'ogame-tracker-combat-report--no-loot'
/*                                      */ : ''
/*                              */}">
                                    ${formatNumber(combatReport.loot[resource])}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `);
            } else {
                addOrSetCustomMessageContent(li, `-`);
            }
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

    const promises = messages.map(async msg => {
        try {
            // prepare message to service worker
            const id = parseIntSafe(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id'), 10);
            if (isNaN(id)) {
                _throw('Message id is NaN');
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
            const ogameCombatReport = await loadOgameCombatReport(messageUrl);

            // skip if is expedition fight and the language is not supported
            if (ogameCombatReport.isExpedition && !isSupportedLanguage(ogameMeta.language)) {
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
            };
            chrome.runtime.sendMessage(workerMessage);

        } catch (error) {
            console.error(error);

            msg.classList.add(cssClasses.messages.base, cssClasses.messages.error);
            msg.classList.remove(cssClasses.messages.hideContent);
            addOrSetCustomMessageContent(msg, false);
        }
    });

    await Promise.all(promises);
}

async function loadOgameCombatReport(url: string): Promise<OgameCombatReport> {
    const response = await fetch(url, { method: 'GET' });
    const html = await response.text();

    const doc = domParser.parseFromString(html, 'text/html');
    const scripts = doc.querySelectorAll('script');
    const combatScript = Array.from(scripts).find(script => (script.textContent ?? '').includes('var combatData =')) ?? _throw(`cannot find ogame combat data ('${url}')`);

    const combatJsonMatch = combatScript.textContent?.match(combatJsonRegex) ?? _throw('no combat json match');
    const combatJson = combatJsonMatch.groups?.json ?? _throw('had combat json match but without content');

    return JSON.parse(combatJson) as OgameCombatReport;
}
