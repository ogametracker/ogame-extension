import { parse } from "date-fns";
import { MessageType } from "../../shared/messages/MessageType";
import { TrackExpeditionMessage } from "../../shared/messages/tracking/TrackExpeditionMessage";
import { dateTimeFormat } from "../../shared/ogame-web/constants";
import { _log } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { tabIds, cssClasses } from "./constants";

let port: chrome.runtime.Port;

export function initExpeditionTracking() {
    setupPort();

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

    const observer = new MutationObserver(() => trackExpeditions(tabContent));
    observer.observe(tabContent, { childList: true, subtree: true });
}

function setupPort() {
    port = chrome.runtime.connect();
    port.onDisconnect.addListener(() => setupPort());
    port.onMessage.addListener(message => _log('message', message));
}

function trackExpeditions(elem: Element) {
    const messages = elem.querySelectorAll(`li.msg[data-msg-id]:not(.${cssClasses.messageProcessed}):not(.${cssClasses.failedToProcessMessage})`);
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
            const text = messageTextElem.textContent;
            const html = messageTextElem.innerHTML;

            // send message to service worker
            const workerMessage: TrackExpeditionMessage = {
                type: MessageType.TrackExpedition,
                ogameMeta: {
                    server: 's123-de', //TODO: server id + lang
                    playerId: 123456, //TODO: player id
                },
                data: {
                    id,
                    date,
                    text,
                    html,
                }
            };
            port.postMessage(workerMessage);

            // mark message as processed
            msg.classList.add(cssClasses.messageProcessed);
        } catch (error) {
            console.error(error);
            msg.classList.add(cssClasses.failedToProcessMessage);
        }
    });
}
