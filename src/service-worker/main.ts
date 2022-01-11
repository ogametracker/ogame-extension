import { Message } from "../shared/messages/Message";
import { MessageType } from "../shared/messages/MessageType";
import { SubscriptionMessage, UnsubscriptionMessage } from "../shared/messages/subscriptions/types";
import { TrackExpeditionMessage } from "../shared/messages/tracking/expeditions";
import { _log, _logError, _logWarning } from "../shared/utils/_log";
import { _throw } from "../shared/utils/_throw";
import { ExpeditionModule } from "./ExpeditionModule";

type SubscriptionMap = Partial<Record<MessageType, ServerSubscriptionMap | undefined>>;
type ServerSubscriptionMap = Record<string, chrome.runtime.Port[] | undefined>;

class ServiceWorker {
    private readonly noSubscriptionsAllowed: MessageType[] = [
        MessageType.Subscribe,
        MessageType.Unsubscribe,
        MessageType.Debug_UnhandledError,
    ];
    private subscriptions: SubscriptionMap = {};
    private readonly expeditionModule = new ExpeditionModule();

    constructor() {
        chrome.runtime.onConnect.addListener(port => {
            port.onMessage.addListener(async (message, port) => await this.onMessage(message, port));

            port.onDisconnect.addListener(port => {
                // remove port from subscriptions
                Object.keys(this.subscriptions).forEach((key: MessageType) => {
                    Object.keys(this.subscriptions[key]).forEach(server => {
                        this.subscriptions[key][server] = this.subscriptions[key][server].filter(p => p != port);
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
        _log('got message', message, port);

        const key = `${message.ogameMeta.server}-${message.ogameMeta.playerId}`;

        switch (message.type) {
            case MessageType.Subscribe: {
                const msg = (message as SubscriptionMessage);
                if (this.noSubscriptionsAllowed.includes(msg.data)) {
                    return;
                }
                this.subscriptions[msg.data] ??= {};
                this.subscriptions[msg.data][key] ??= [];
                this.subscriptions[msg.data][key].push(port);
                return;
            }

            case MessageType.Unsubscribe: {
                const msg = (message as UnsubscriptionMessage);
                this.subscriptions[msg.data] ??= {};
                this.subscriptions[msg.data][key] ??= [];
                this.subscriptions[msg.data][key] = this.subscriptions[msg.type][key].filter(p => p != port);
                return;
            }

            case MessageType.TrackExpedition: {
                const { success, result } = await this.expeditionModule.tryTrackExpedition(message as TrackExpeditionMessage);
                if (!success) {
                    _throw('failed to track expedition');
                }

                this.sendMessage({
                    ogameMeta: message.ogameMeta,
                    type: MessageType.ExpeditionEvent,
                    data: result,
                }, port);
                break;
            }

            default: {
                _log('unhandled message', message, port);
                break;
            }
        }
    }

    private sendMessage<TData, TMessage extends Message<MessageType, TData>>(message: TMessage, port: chrome.runtime.Port) {
        const key = `${message.ogameMeta.server}-${message.ogameMeta.playerId}`;

        const ports = [
            port,
            ...(this.subscriptions?.[message.type]?.[key] ?? []).filter(p => p != port),
        ];

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