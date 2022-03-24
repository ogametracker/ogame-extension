import { NoDataMessage } from '../messages/Message';
import { MessageType } from '../messages/MessageType';
import { _logDebug } from '../utils/_log';
import { ignoreStupidMessagePortErrors } from './ignoreStupidMessagePortErrors';
import { sendMessage } from './sendMessage';

export async function broadcastMessage<T extends NoDataMessage<MessageType>>(message: T) {
    _logDebug('broadcasting message', message);
    sendMessage(message);

    const tabs = await chrome.tabs.query({ url: '*://*.ogame.gameforge.com/*' });
    tabs.forEach(tab => {
        if (tab.id == null) {
            return;
        }
        chrome.tabs.sendMessage(tab.id, message, ignoreStupidMessagePortErrors);
    });
}