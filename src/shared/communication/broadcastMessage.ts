export async function broadcastMessage(message: any) {
    chrome.runtime.sendMessage(message);

    const tabs = await chrome.tabs.query({ url: '*://*.ogame.gameforge.com/*' });
    tabs.forEach(tab => {
        if(tab.id == null) {
            return;
        }
        chrome.tabs.sendMessage(tab.id, message);
    });
}