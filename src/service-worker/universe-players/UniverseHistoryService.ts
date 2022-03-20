import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { UniverseHistoryModule } from './UniverseHistoryModule';

export class UniverseHistoryService implements MessageService {
    private readonly module = new UniverseHistoryModule();

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        this.module.wake(message.ogameMeta);
    }
}