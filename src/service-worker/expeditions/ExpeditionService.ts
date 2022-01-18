import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { AllExpeditionsMessage, ExpeditionMessage, NewExpeditionMessage, TrackExpeditionMessage } from '../../shared/messages/tracking/expeditions';
import { _throw } from '../../shared/utils/_throw';
import { MessageService, MessageServiceEventInfo } from '../MessageService';
import { ExpeditionModule } from './ExpeditionModule';

export class ExpeditionService implements MessageService {
    private readonly expeditionModule = new ExpeditionModule();

    public async onMessage(message: Message<MessageType, any>, info: MessageServiceEventInfo): Promise<void> {
        switch (message.type) {
            case MessageType.TrackExpedition: {
                const tryResult = await this.expeditionModule.tryTrackExpedition(message as TrackExpeditionMessage);
                if (!tryResult.success) {
                    _throw('failed to track expedition');
                }

                const { expedition, isAlreadyTracked } = tryResult.result;

                // send data of the specific expedition
                const expeditionMessage: ExpeditionMessage = {
                    ogameMeta: message.ogameMeta,
                    type: MessageType.Expedition,
                    data: expedition,
                };
                info.broadcast(expeditionMessage, info.sender);

                // broadcast "new expedition available"
                if(!isAlreadyTracked) {
                    const newExpeditionMessage: NewExpeditionMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.NewExpedition,
                        data: expedition,
                    };
                    info.broadcast(newExpeditionMessage);
                }
                break;
            }

            case MessageType.RequestExpeditionEvents: {
                await this.broadcastAllExpeditions(message.ogameMeta, info);
                break;
            }
        }
    }


    private async broadcastAllExpeditions(meta: MessageOgameMeta, info: MessageServiceEventInfo) {
        const expeditionEvents = await this.expeditionModule.getExpeditionEvents(meta);

        const allExpeditionMessage: AllExpeditionsMessage = {
            ogameMeta: meta,
            type: MessageType.AllExpeditions,
            data: expeditionEvents,
        };
        info.broadcast(allExpeditionMessage, info.sender);
    }
}