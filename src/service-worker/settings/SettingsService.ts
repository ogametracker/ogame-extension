import { Message, MessageOgameMeta } from '@ogame-tracker/shared/messages/Message';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import { MessageService } from '../MessageService';
import { broadcastMessage } from '@ogame-tracker/shared/communication/broadcastMessage';
import { SettingsMessage } from '@ogame-tracker/shared/messages/settings';
import { serviceWorkerUuid } from '@ogame-tracker/shared/uuid';
import { Settings } from '@ogame-tracker/shared/models/settings/Settings';
import { LanguageKey } from '@ogame-tracker/shared/i18n/LanguageKey';
import { loadSettings } from '@ogame-tracker/shared/models/settings/loadSettings';
import { getLanguage } from '@ogame-tracker/shared/i18n/getLanguage';

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