import { parse } from "date-fns";
import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { Message } from "../../shared/messages/Message";
import { MessageType } from "../../shared/messages/MessageType";
import { dateTimeFormat } from "../../shared/ogame-web/constants";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { _logDebug } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { addOrSetCustomMessageContent, cssClasses, formatNumber, tabIds } from "./utils";
import { WillNotBeTrackedMessage } from '../../shared/messages/tracking/misc';
import { DebrisFieldReportMessage, TrackDebrisFieldReportMessage } from '../../shared/messages/tracking/debris-fields';

export function initDebrisFieldReportTracking() {
    setupCommunication();

    const contentElem = document.querySelector('#content .content') ?? _throw('Cannot find content element');
    const initObserver = new MutationObserver(() => {
        const fleetsTab = document.querySelector('#fleetsTab');
        if (fleetsTab != null) {
            initObserver.disconnect();
            setupObserver();
        }
    });
    initObserver.observe(contentElem, { subtree: true, childList: true });
}

function setupObserver() {
    const tabLabel = document.querySelector(`[id^="subtabs-"][data-tabid="${tabIds.misc}"]`) ?? _throw('Cannot find label of misc messages');
    const tabContentId = tabLabel.getAttribute('aria-controls') ?? _throw('Cannot find id of misc messages tab content');
    const tabContent = document.querySelector(`#${tabContentId}`) ?? _throw('Cannot find content element of misc messages');

    const meta = getOgameMeta();
    if (isSupportedLanguage(meta.language)) {
        const observer = new MutationObserver(() => trackDebrisFieldReports(tabContent));
        observer.observe(tabContent, { childList: true, subtree: true });
    }
}

function setupCommunication() {
    chrome.runtime.onMessage.addListener(message => onMessage(message));
}

function onMessage(message: Message<MessageType, any>) {
    switch (message.type) {
        case MessageType.DebrisFieldReport:
        case MessageType.NewDebrisFieldReport: {
            const msg = message as DebrisFieldReportMessage;
            
            const li = document.querySelector(`li.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find debris field report with id '${msg.data.id}'`);
            li.classList.add(cssClasses.messages.debrisFieldReport);

            li.classList.remove(cssClasses.messages.waitingToBeProcessed);
            li.classList.add(cssClasses.messages.processed);
            addOrSetCustomMessageContent(li, `
                <div class="ogame-tracker-debris-field-report">
                    <div class="ogame-tracker-resource metal"></div>
                    <div class="ogame-tracker-resource crystal"></div>
                    <div class="">${formatNumber(msg.data.metal)}</div>
                    <div class="">${formatNumber(msg.data.crystal)}</div>
                </div>
            `);
            break;
        }

        case MessageType.WillNotBeTracked: {
            const msgId = (message as WillNotBeTrackedMessage).data;
            //TODO: mark message as untracked
            const li = document.querySelector(`li.msg[data-msg-id="${msgId}"]`) ?? _throw(`failed to find debris field report with id '${msgId}'`);

            li.classList.remove(cssClasses.messages.waitingToBeProcessed);
            li.classList.remove(cssClasses.messages.hideContent);
            addOrSetCustomMessageContent(li, false);
            break;
        }
    }
}

function trackDebrisFieldReports(elem: Element) {
    const messages = Array.from(elem.querySelectorAll('li.msg[data-msg-id]'))
    .filter(elem => !elem.classList.contains(cssClasses.messages.base));

    messages.forEach(msg => {
        try {
            // prepare message to service worker
            const id = parseInt(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id'));
            if (isNaN(id)) {
                _throw('Message id is NaN');
            }

            const dateText = msg.querySelector('.msg_head .msg_date')?.textContent ?? _throw('Cannot find message date');
            const date = parse(dateText, dateTimeFormat, new Date()).getTime();
            if (isNaN(date)) {
                _throw('Message date is NaN');
            }

            const messageTextElem = msg.querySelector('.msg_content') ?? _throw('Cannot find message content element');
            const text = messageTextElem.textContent ?? '';
            const html = messageTextElem.innerHTML;

            // send message to service worker
            const workerMessage: TrackDebrisFieldReportMessage = {
                type: MessageType.TrackDebrisFieldReport,
                ogameMeta: getOgameMeta(),
                data: {
                    id,
                    date,
                    text,
                    html,
                },
            };
            chrome.runtime.sendMessage(workerMessage);

            // mark message as "waiting for result"
            msg.classList.add(
                cssClasses.messages.base, 
                cssClasses.messages.waitingToBeProcessed, 
                cssClasses.messages.hideContent,
            );
            addOrSetCustomMessageContent(msg, `<div class="ogame-tracker-loader"></div>`);
        } catch (error) {
            console.error(error);

            msg.classList.add(cssClasses.messages.base, cssClasses.messages.error);
            msg.classList.remove(cssClasses.messages.hideContent);
            addOrSetCustomMessageContent(msg, false);
        }
    });
}