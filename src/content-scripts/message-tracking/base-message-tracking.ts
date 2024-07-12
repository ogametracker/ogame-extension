import { _throw } from "@/shared/utils/_throw";
import { debrisFieldTracking } from "./debris-field-report-tracking";

const trackings = [
    debrisFieldTracking,
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
        trackings.forEach(t => t.track());
    });

    observer.observe(tabContentElement, { childList: true, subtree: true });
}