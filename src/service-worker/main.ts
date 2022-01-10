import { Message } from "../shared/messages/Message";
import { MessageType } from "../shared/messages/MessageType";
import { SubscriptionMessage } from "../shared/messages/subscriptions/types";
import { _log } from "../shared/utils/_log";

const subscriptions: Partial<Record<MessageType, chrome.runtime.Port[] | undefined>> = {};

chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener((message, port) => onMessage(message, port));

    port.onDisconnect.addListener(port => {
        // remove port from subscriptions
        Object.keys(subscriptions).forEach((key: MessageType) => {
            subscriptions[key] = subscriptions[key].filter(p => p != port);
        });
    });
});

function onMessage(message: Message<MessageType, any>, port: chrome.runtime.Port) {
    _log('got message', message, port);

    switch (message.type) {
        case MessageType.Subscribe: {
            const msgType = (message as SubscriptionMessage).data;
            subscriptions[msgType] ??= [];
            subscriptions[msgType].push(port);
            break;
        }

        case MessageType.Unsubscribe: {
            const msgType = (message as SubscriptionMessage).data;
            subscriptions[msgType] = subscriptions[msgType].filter(p => p != port);
            break;
        }

        default: {
            _log('unhandles message', message, port);
            break;
        }
    }
}