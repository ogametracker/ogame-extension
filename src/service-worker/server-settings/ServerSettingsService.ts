import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { ServerSettingsModule } from './ServerSettingsModule';
import { ServerSettingsDataMessage } from '@/shared/messages/tracking/server-settings';

export class ServerSettingsService implements MessageService {
    private readonly module = new ServerSettingsModule();

    constructor() {
        this.module.addBroadcastNotifyListener(meta => this.broadcastServerSettings(meta));
    }

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        this.module.wake(message.ogameMeta);

        switch (message.type) {
            case MessageType.RequestServerSettingsData: {
                await this.broadcastServerSettings(message.ogameMeta);
                break;
            }
        }
    }

    private async broadcastServerSettings(meta: MessageOgameMeta): Promise<void> {
        const history = await this.module.getServerSettings(meta);

        const message: ServerSettingsDataMessage = {
            ogameMeta: meta,
            type: MessageType.ServerSettingsData,
            data: history,
        };
        await broadcastMessage(message);
    }
}