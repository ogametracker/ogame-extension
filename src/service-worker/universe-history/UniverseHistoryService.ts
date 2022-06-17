import { Message } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { UniverseHistoryModule } from './UniverseHistoryModule';
import { getStorageKeyPrefix } from '@/shared/utils/getStorageKeyPrefix';
import { _logDebug } from '@/shared/utils/_log';

export class UniverseHistoryService implements MessageService {
    private readonly modules: Record<string, UniverseHistoryModule> = {};

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        const key = getStorageKeyPrefix(message.ogameMeta, false);

        if(message.type == MessageType.NotifySettingsUpdate) {
            _logDebug('re-init universe history tracking after settings change');
            
            for(const key of Object.keys(this.modules)) {
                await this.modules[key].init();
            }
        }

        if (this.modules[key] != null) {
            return;
        }

        const module = this.modules[key] = new UniverseHistoryModule(message.ogameMeta);
        await module.init();
    }
}