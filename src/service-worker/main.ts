import { Message } from "../shared/messages/Message";
import { MessageType } from "../shared/messages/MessageType";
import { SubscriptionMessage, UnsubscriptionMessage } from "../shared/messages/subscriptions/types";
import { getStorageKeyPrefix } from "../shared/utils/getStorageKeyPrefix";
import { _log, _logDebug, _logError, _logWarning } from "../shared/utils/_log";
import { _throw } from "../shared/utils/_throw";
import { ExpeditionService } from "./expeditions/ExpeditionService";
import { MessageService, MessageServiceEventInfo } from "./MessageService";

type SubscriptionMap = Partial<Record<MessageType, ServerSubscriptionMap | undefined>>;
type ServerSubscriptionMap = Record<string, chrome.runtime.Port[] | undefined>;


try {
    const noSubscriptionsAllowed: MessageType[] = [
        MessageType.Subscribe,
        MessageType.Unsubscribe,
        MessageType.Debug_UnhandledError,
    ];
    const subscriptions: SubscriptionMap = {};
    const services: MessageService[] = [
        new ExpeditionService(),
    ];

    chrome.runtime.onMessage.addListener(message => console.log(message));

    chrome.runtime.onConnect.addListener(port => {
        _log('port connected', port);
        port.onMessage.addListener(async (message, port) => await onMessage(message, port));

        port.onDisconnect.addListener(port => {
            // remove port from subscriptions
            (Object.keys(subscriptions) as MessageType[]).forEach(key => {
                const subs = subscriptions[key]!;

                Object.keys(subs).forEach(server => {
                    subs[server] = subs[server]!.filter(p => p != port);
                });
            });
        });
    });

    performMigrations();

    function performMigrations() {
        _logWarning('TODO: perform migrations');
        //TODO: perform migrations
    }

    async function onMessage(message: Message<MessageType, any>, port: chrome.runtime.Port) {
        _log('got message', performance.now(), message, port);

        const key = getStorageKeyPrefix(message.ogameMeta);
        const eventInfo: MessageServiceEventInfo = {
            sender: port,
            broadcast: (message, ...includePorts) => sendMessage(message, ...includePorts),
        }

        switch (message.type) {
            case MessageType.Subscribe: {
                const msg = (message as SubscriptionMessage);
                if (noSubscriptionsAllowed.includes(msg.data)) {
                    return;
                }
                const subs = (subscriptions[msg.data] ??= {});
                const serverSubscriptions = (subs[key] ??= []);
                serverSubscriptions.push(port);
                return;
            }

            case MessageType.Unsubscribe: {
                const msg = (message as UnsubscriptionMessage);
                const subs = (subscriptions[msg.data] ??= {});
                subs[key] = (subs[key] ?? []).filter(p => p != port);
                return;
            }

            default: {
                for (const service of services) {
                    await service.onMessage(message, eventInfo);
                }
                break;
            }
        }
    }

    function sendMessage<TData, TMessage extends Message<MessageType, TData>>(message: TMessage, ...includePorts: chrome.runtime.Port[]) {
        _log('broadcasting message', performance.now(), { message, includePorts });
        const key = getStorageKeyPrefix(message.ogameMeta);

        const ports = (subscriptions?.[message.type]?.[key] ?? []);
        ports.push(...includePorts.filter(p => !ports.includes(p)));

        ports.forEach(p => {
            p.postMessage(message);
        });
    }
} catch (error) {
    _logError(error);
}