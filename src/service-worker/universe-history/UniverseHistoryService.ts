import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { UniverseHistoryModule } from './UniverseHistoryModule';
import { UniverseHistoryDataMessage } from '../../shared/messages/tracking/universe-history';

export class UniverseHistoryService implements MessageService {
    private readonly module = new UniverseHistoryModule();

    constructor() {
        this.module.addBroadcastNotifyListener(meta => this.broadcastUniverseHistory(meta));
    }

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        this.module.wake(message.ogameMeta);

        switch (message.type) {
            case MessageType.RequestUniverseHistoryData: {
                this.broadcastUniverseHistory(message.ogameMeta);
                break;
            }
        }
    }

    private async broadcastUniverseHistory(meta: MessageOgameMeta): Promise<void> {
        const history = await this.module.getHistory(meta);

        const message: UniverseHistoryDataMessage = {
            ogameMeta: meta,
            type: MessageType.UniverseHistoryData,
            data: history,
        };
        broadcastMessage(message);
    }
}