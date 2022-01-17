import { ExpeditionEvent } from '@/shared/models/v1/expeditions/ExpeditionEvents';
import { MessageType } from '@/shared/messages/MessageType';
import { AllExpeditionsMessage, RequestExpeditionEventsMessage } from '@/shared/messages/tracking/expeditions';
import { SubscriptionMessage } from '@/shared/messages/subscriptions/types';
import { Message } from '@/shared/messages/Message';

export class ExpeditionDataModule {
    private _port = chrome.runtime.connect();
    public expeditions: ExpeditionEvent[] = [];

    constructor() {
        this._port.onDisconnect.addListener(() => this._port = chrome.runtime.connect());

        this._port.onMessage.addListener(message => this.onMessage(message));

        const subscribeMessage: SubscriptionMessage = {
            type: MessageType.Subscribe,
            ogameMeta: {
                //TODO: ogame meta
                serverId: 146,
                language: 'de',
                playerId: 117848,
            },
            data: MessageType.AllExpeditions,
        };
        this._port.postMessage(subscribeMessage);

        this.requestData();
    }

    private requestData() {
        const message: RequestExpeditionEventsMessage = {
            type: MessageType.RequestExpeditionEvents,
            ogameMeta: {
                //TODO: ogame meta
                serverId: 146,
                language: 'de',
                playerId: 117838,
            },
            data: undefined,
        };
        this._port.postMessage(message);
    }

    private onMessage(msg: Message) {
        const { type } = msg;

        switch (type) {
            case MessageType.AllExpeditions: {
                const { data } = msg as AllExpeditionsMessage;
                this.expeditions = data;
                break;
            }
        }
    }
}