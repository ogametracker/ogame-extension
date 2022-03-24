import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { SettingsModule } from './SettingsModule';
import { SettingsMessage, UpdateSettingsMessage } from '../../shared/messages/settings';

export class SettingsService implements MessageService {
    private readonly module = new SettingsModule();

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch(message.type) {
            case MessageType.UpdateSettings: {
                const msg = message as UpdateSettingsMessage;
                await this.module.updateSettings(msg);
                await this.broadcastSettings(message.ogameMeta);
                break;
            }
            
            case MessageType.RequestSettings: {
                await this.broadcastSettings(message.ogameMeta);
                break;
            }
        }
    }

    private async broadcastSettings(meta: MessageOgameMeta): Promise<void> {
        const settings = await this.module.getSettings(meta);

        const settingsMessage: SettingsMessage = {
            ogameMeta: meta,
            type: MessageType.Settings,
            data: settings,
        };
        await broadcastMessage(settingsMessage);
    }
}