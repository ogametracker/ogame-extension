import { Message } from '@ogame-tracker/shared/messages/Message';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import { MessageService } from '../MessageService';
import { broadcastMessage } from '@ogame-tracker/shared/communication/broadcastMessage';
import { MessageTrackingErrorMessage } from '@ogame-tracker/shared/messages/tracking/misc';
import { serviceWorkerUuid } from '@ogame-tracker/shared/uuid';
import {
    LifeformDiscoveryMessage,
    NewLifeformDiscoveryMessage,
    TrackLifeformDiscoveryMessage,
} from '@ogame-tracker/shared/messages/tracking/lifeform-discoveries';
import { LifeformDiscoveryModule } from './LifeformDiscoveryModule';

export class LifeformDiscoveryService implements MessageService {
    private readonly lifeformDiscoveryModule = new LifeformDiscoveryModule();

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch (message.type) {
            case MessageType.TrackLifeformDiscovery: {
                const msg = message as TrackLifeformDiscoveryMessage;
                const tryResult = await this.lifeformDiscoveryModule.tryTrackExpedition(msg);

                if (!tryResult.success) {
                    const errorMessage: MessageTrackingErrorMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.TrackingError,
                        data: {
                            id: msg.data.id,
                            type: 'lifeform-discovery',
                        },
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(errorMessage);
                    return;
                }

                const { lifeformDiscovery, isAlreadyTracked } = tryResult.result;

                // broadcast "new lifeform discovery available"
                if (!isAlreadyTracked) {
                    const newLifeformDiscoveryExpeditionMessage: NewLifeformDiscoveryMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.NewLifeformDiscovery,
                        data: lifeformDiscovery,
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(newLifeformDiscoveryExpeditionMessage);
                }
                // send data of the specific lifeform discovery
                else {
                    const lifeformDiscoveryMessage: LifeformDiscoveryMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.LifeformDiscovery,
                        data: lifeformDiscovery,
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(lifeformDiscoveryMessage);
                }

                break;
            }
        }
    }
}
