import { Message, MessageOgameMeta } from '@ogame-tracker/shared/messages/Message';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import { MessageService } from '../MessageService';
import { ServerSettingsModule } from './ServerSettingsModule';
import { getStorageKeyPrefix } from '@ogame-tracker/shared/utils/getStorageKeyPrefix';

export class ServerSettingsService implements MessageService {
    private readonly modules: Record<string, ServerSettingsModule> = {};

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        const module = await this.initModule(message.ogameMeta);

        switch (message.type) {
            case MessageType.ForceUpdateServerSettings: {
                await module.update();
                break;
            }
        }
    }

    private async initModule(meta: MessageOgameMeta): Promise<ServerSettingsModule> {
        const key = getStorageKeyPrefix(meta, false);

        let module = this.modules[key];
        if (module != null) {
            return module;
        }

        module = new ServerSettingsModule(meta);
        this.modules[key] = module;

        return module;
    }
}
