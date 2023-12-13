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
import { getLanguage } from '@/shared/i18n/getLanguage';

export class SettingsService implements MessageService {
    private _settings: Settings = null!;

    private _ready!: Promise<void>;
    private _resolveReady!: () => void;
    public get ready(): Promise<void> {
        return this._ready;
    }

    public get settings(): Settings {
        return this._settings;
    }

    constructor() {
        this._ready = new Promise<void>(resolve => this._resolveReady = resolve);
        void this.initSettings();
    }

    private async initSettings() {
        this._settings = await loadSettings('__internal__' as LanguageKey);
        this._resolveReady();
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
        const lang = getLanguage(meta.userLanguage) ?? LanguageKey.en;
        const settings = await loadSettings(lang);

        const settingsMessage: SettingsMessage = {
            ogameMeta: meta,
            type: MessageType.Settings,
            data: settings,
            senderUuid: uuid ?? serviceWorkerUuid,
        };
        await broadcastMessage(settingsMessage);
    }
}