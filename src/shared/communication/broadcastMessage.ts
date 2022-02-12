import { _logDebug } from '../utils/_log';

export async function broadcastMessage(message: any) {
    _logDebug('broadcasting message', message);
    chrome.runtime.sendMessage(message);

    const tabs = await chrome.tabs.query({ url: '*://*.ogame.gameforge.com/*' });
    tabs.forEach(tab => {
        if (tab.id == null) {
            return;
        }
        chrome.tabs.sendMessage(tab.id, message);
    });
}