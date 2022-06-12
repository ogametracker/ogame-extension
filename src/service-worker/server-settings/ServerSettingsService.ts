import { Message } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { ServerSettingsModule } from './ServerSettingsModule';
import { getStorageKeyPrefix } from '@/shared/utils/getStorageKeyPrefix';

export class ServerSettingsService implements MessageService {
    private readonly modules: Record<string, ServerSettingsModule> = {};

    public onMessage(message: Message<MessageType, any>): Promise<void> {
        const key = getStorageKeyPrefix(message.ogameMeta, false);

        if (this.modules[key] != null) {
            return Promise.resolve();
        }

        const module = new ServerSettingsModule(message.ogameMeta);
        this.modules[key] = module;

        return Promise.resolve();
    }
}