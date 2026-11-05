import { Message, MessageOgameMeta } from '@ogame-tracker/shared/messages/Message';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import { ExpeditionMessage, NewExpeditionMessage, TrackExpeditionMessage } from '@ogame-tracker/shared/messages/tracking/expeditions';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import { MessageService } from '../MessageService';
import { ExpeditionModule } from './ExpeditionModule';
import { broadcastMessage } from '@ogame-tracker/shared/communication/broadcastMessage';
import { MessageTrackingErrorMessage } from '@ogame-tracker/shared/messages/tracking/misc';
import { serviceWorkerUuid } from '@ogame-tracker/shared/uuid';

export class ExpeditionService implements MessageService {
    private readonly expeditionModule = new ExpeditionModule();

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        if (message.type != MessageType.TrackExpedition) {
            return;
        }
        
        const msg = message as TrackExpeditionMessage;
        const tryResult = await this.expeditionModule.tryTrackExpedition(msg);

        if (!tryResult.success) {
            const errorMessage: MessageTrackingErrorMessage = {
                ogameMeta: message.ogameMeta,
                type: MessageType.TrackingError,
                data: {
                    id: msg.data.id,
                    type: 'expedition',
                },
                senderUuid: serviceWorkerUuid,
            };
            await broadcastMessage(errorMessage);
            return;
        }

        const { expedition, isAlreadyTracked } = tryResult.result;

        // broadcast "new expedition available"
        if (!isAlreadyTracked) {
            const newExpeditionMessage: NewExpeditionMessage = {
                ogameMeta: message.ogameMeta,
                type: MessageType.NewExpedition,
                data: expedition,
                senderUuid: serviceWorkerUuid,
            };
            await broadcastMessage(newExpeditionMessage);
        }
        // send data of the specific expedition
        else {
            const expeditionMessage: ExpeditionMessage = {
                ogameMeta: message.ogameMeta,
                type: MessageType.Expedition,
                data: expedition,
                senderUuid: serviceWorkerUuid,
            };
            await broadcastMessage(expeditionMessage);
        }
    }
}