import { parse } from "date-fns";
import { Message } from "../../shared/messages/Message";
import { MessageType } from "../../shared/messages/MessageType";
import { ExpeditionMessage, TrackExpeditionMessage } from "../../shared/messages/tracking/expeditions";
import { dateTimeFormat } from "../../shared/ogame-web/constants";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { _log, _logDebug, _logWarning } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { tabIds, cssClasses } from "./constants";

export function initExpeditionTracking() {
    setupCommunication();

    const contentElem = document.querySelector('#content .content') ?? _throw('Cannot find content element');
    const initObserver = new MutationObserver(() => {
        const fleetsTab = document.querySelector('#fleetsTab');
        if (fleetsTab != null) {
            initObserver.disconnect();
            setupExpeditionMessageObserver();
        }
    });
    initObserver.observe(contentElem, { subtree: true, childList: true });
}

function setupExpeditionMessageObserver() {
    const tabLabel = document.querySelector(`[id^="subtabs-"][data-tabid="${tabIds.expedition}"]`) ?? _throw('Cannot find label of expedition messages');
    const tabContentId = tabLabel.getAttribute('aria-controls') ?? _throw('Cannot find id of expedition messages tab content');
    const tabContent = document.querySelector(`#${tabContentId}`) ?? _throw('Cannot find content element of expedition messages');

    const meta = getOgameMeta();
    if (isSupportedLanguage(meta.language)) {
        const observer = new MutationObserver(() => trackExpeditions(tabContent));
        observer.observe(tabContent, { childList: true, subtree: true });
    }
}

function setupCommunication() {
    chrome.runtime.onMessage.addListener(message => onMessage(message));
}

function onMessage(message: Message<MessageType, any>) {
    _logDebug('got message', message);

    switch (message.type) {
        case MessageType.Debug_UnhandledError: {
            alert('Unhandled exception, contact the developer');
            return;
        }

        case MessageType.Expedition: {
            const msg = message as ExpeditionMessage;
            const li = document.querySelector(`li.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find expedition message with id '${msg.data.id}'`);
            Object.values(cssClasses).forEach(cssClass => li.classList.remove(cssClass));
            li.classList.add(cssClasses.messageProcessed);
            break;
        }

        default: {
            _logWarning('got message that we were not listening for', message);
            return;
        }
    }
}

function trackExpeditions(elem: Element) {
    const messages = Array.from(elem.querySelectorAll('li.msg[data-msg-id]'))
        .filter(elem => !Object.values(cssClasses).some(cssClass => elem.classList.contains(cssClass)));

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
            const workerMessage: TrackExpeditionMessage = {
                type: MessageType.TrackExpedition,
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
            msg.classList.add(cssClasses.waitingToProcessMessage);
        } catch (error) {
            console.error(error);
            msg.classList.add(cssClasses.failedToProcessMessage);
        }
    });
}
