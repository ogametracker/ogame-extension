import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { ExpeditionMessage, NewExpeditionMessage, TrackExpeditionMessage } from '../../shared/messages/tracking/expeditions';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { ExpeditionModule } from './ExpeditionModule';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { MessageTrackingErrorMessage } from '@/shared/messages/tracking/misc';

export class ExpeditionService implements MessageService {
    private readonly expeditionModule = new ExpeditionModule();

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch (message.type) {
            case MessageType.TrackExpedition: {
                const msg = message as TrackExpeditionMessage;
                const tryResult = await this.expeditionModule.tryTrackExpedition(msg);

                if (!tryResult.success) {
                    const errorMessage: MessageTrackingErrorMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.TrackingError,
                        data: msg.data.id,
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
                    };
                    await broadcastMessage(newExpeditionMessage);
                }
                // send data of the specific expedition
                else {
                    const expeditionMessage: ExpeditionMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.Expedition,
                        data: expedition,
                    };
                    await broadcastMessage(expeditionMessage);
                }

                break;
            }
        }
    }
}