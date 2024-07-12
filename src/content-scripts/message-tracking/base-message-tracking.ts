import { _throw } from "@/shared/utils/_throw";
import { debrisFieldTracking } from "./debris-field-report-tracking";
import { Message } from "@/shared/messages/Message";
import { MessageType } from "@/shared/messages/MessageType";
import { OgameRawMessageType } from "@/shared/models/ogame/messages/OgameRawMessageType";
import { parseIntSafe } from "@/shared/utils/parseNumbers";
import { cssClasses } from "./utils";
import { expeditionTracking } from "./expedition-tracking";

type Tracking = {
    onMessage: (message: Message<MessageType, any>) => void;
    messageType: OgameRawMessageType;
    track: (messages: Element[]) => void;
};

const trackings: Tracking[] = [
    debrisFieldTracking,
    expeditionTracking,
];

let pageContentElement: Element | null = null;

export function initMessageTracking() {
    trackings.forEach(t => {
        chrome.runtime.onMessage.addListener(message => t.onMessage(message));
    });

    const contentElem = document.querySelector('#pageContent .content') ?? _throw('Cannot find content element');
    const initObserver = new MutationObserver(() => {
        if (pageContentElement?.isConnected != true) {
            setupObserver();
        }
    });
    initObserver.observe(contentElem, { subtree: true, childList: true });
}

function setupObserver() {
    pageContentElement = document.querySelector(`.messagesHolder`);
    const tabContentElement = pageContentElement ?? _throw('Cannot find messages holder element');

    const observer = new MutationObserver(() => {
        trackings.forEach(t => trackMessages(t));
    });

    observer.observe(tabContentElement, { childList: true, subtree: true });
}

function trackMessages(tracking: Tracking) {
    const messages = Array.from(document.querySelectorAll('div.msg[data-msg-id]'))
        .filter(elem => {
            const messageType = parseIntSafe(
                elem.querySelector('.rawMessageData')?.getAttribute('data-raw-messagetype') 
                ?? '-1' // for some reason not all messages have a type attribute, e.g. espionage reports, so we fall back to something unused
            );

            return messageType == tracking.messageType
                && !elem.classList.contains(cssClasses.messages.base);
        });

    tracking.track(messages);
}