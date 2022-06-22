import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { SettingsMessage } from '../../shared/messages/settings';
import { serviceWorkerUuid } from '@/shared/uuid';
import { Settings } from '@/shared/models/settings/Settings';
import { LanguageKey } from '@/shared/i18n/LanguageKey';
import { loadSettings } from '@/shared/models/settings/loadSettings';

export class SettingsService implements MessageService {
    private _settings: Settings = null!;

    public get settings(): Settings {
        return this._settings;
    }

    constructor() {
        void this.initSettings();
    }

    private async initSettings() {
        this._settings = await loadSettings('__internal__' as LanguageKey);
    }

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch(message.type) {            
            case MessageType.RequestSettings: {
                await this.broadcastSettings(message.ogameMeta);
                break;
            }

            case MessageType.NotifySettingsUpdate: {
                await this.initSettings();
                break;
            }
        }
    }

    private async broadcastSettings(meta: MessageOgameMeta, uuid?: string): Promise<void> {
        const settings = this._settings

        const settingsMessage: SettingsMessage = {
            ogameMeta: meta,
            type: MessageType.Settings,
            data: settings,
            senderUuid: uuid ?? serviceWorkerUuid,
        };
        await broadcastMessage(settingsMessage);
    }
}