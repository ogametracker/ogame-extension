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

class ServiceWorker {
    private readonly noSubscriptionsAllowed: MessageType[] = [
        MessageType.Subscribe,
        MessageType.Unsubscribe,
        MessageType.Debug_UnhandledError,
    ];
    private subscriptions: SubscriptionMap = {};
    private readonly services: MessageService[] = [
        new ExpeditionService(),
    ];

    constructor() {
        chrome.runtime.onConnect.addListener(port => {
            _log('port connected', port);
            port.onMessage.addListener(async (message, port) => await this.onMessage(message, port));

            port.onDisconnect.addListener(port => {
                // remove port from subscriptions
                (Object.keys(this.subscriptions) as MessageType[]).forEach(key => {
                    const subs = this.subscriptions[key]!;

                    Object.keys(subs).forEach(server => {
                        subs[server] = subs[server]!.filter(p => p != port);
                    });
                });
            });
        });

        this.performMigrations();
    }

    private performMigrations() {
        _logWarning('TODO: perform migrations');
        //TODO: perform migrations
    }

    private async onMessage(message: Message<MessageType, any>, port: chrome.runtime.Port) {
        _log('got message', performance.now(), message, port);

        const key = getStorageKeyPrefix(message.ogameMeta);
        const eventInfo: MessageServiceEventInfo = {
            sender: port,
            broadcast: (message, ...includePorts) => this.sendMessage(message, ...includePorts),
        }

        switch (message.type) {
            case MessageType.Subscribe: {
                const msg = (message as SubscriptionMessage);
                if (this.noSubscriptionsAllowed.includes(msg.data)) {
                    return;
                }
                const subscriptions = (this.subscriptions[msg.data] ??= {});
                const serverSubscriptions = (subscriptions[key] ??= []);
                serverSubscriptions.push(port);
                return;
            }

            case MessageType.Unsubscribe: {
                const msg = (message as UnsubscriptionMessage);
                const subscriptions = (this.subscriptions[msg.data] ??= {});
                subscriptions[key] = (subscriptions[key] ?? []).filter(p => p != port);
                return;
            }

            default: {
                for (const service of this.services) {
                    await service.onMessage(message, eventInfo);
                }
                break;
            }
        }
    }

    private sendMessage<TData, TMessage extends Message<MessageType, TData>>(message: TMessage, ...includePorts: chrome.runtime.Port[]) {
        _log('broadcasting message', performance.now(), { message, includePorts });
        const key = getStorageKeyPrefix(message.ogameMeta);

        const ports = (this.subscriptions?.[message.type]?.[key] ?? []);
        ports.push(...includePorts.filter(p => !ports.includes(p)));

        ports.forEach(p => {
            p.postMessage(message);
        });
    }
}

try {
    const $serviceWorker = new ServiceWorker();
} catch (error) {
    _logError(error);
}