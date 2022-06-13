import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData, statsViewUuid } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { Settings } from '@/shared/models/settings/Settings';
import { NotifySettingsUpdateMessage } from '@/shared/messages/settings';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { getGlobalDatabase } from '@/shared/db/access';
import { getDefaultSettings } from '@/shared/models/settings/getDefaultSettings';
import { LanguageKey } from '@/shared/i18n/LanguageKey';

@Component
class SettingsDataModuleClass extends Vue {
    public settings: Settings = null!;

    private _ready!: Promise<void>;
    private _resolveReady!: () => void;

    public updateSettings(settings: Settings) {
        console.debug('updating settings', settings);
        this.settings = settings;

        void (async () => {
            const db = await getGlobalDatabase();
            await db.put('settings', settings, 0);

            const msg: NotifySettingsUpdateMessage = {
                ogameMeta: GlobalOgameMetaData,
                senderUuid: statsViewUuid,
                type: MessageType.NotifySettingsUpdate,
            }
            await broadcastMessage(msg);
        });
    }

    public get ready(): Promise<void> {
        return this._ready;
    }

    private async created() {
        this._ready = new Promise<void>(resolve => this._resolveReady = resolve);

        this.initCommunication();
        await this.loadData();
    }

    private initCommunication() {
        console.log('connecting to background service');

        chrome.runtime.onMessage.addListener(async message => await this.onMessage(message));
    }

    private async loadData() {
        const db = await getGlobalDatabase();
        this.settings = await db.get('settings', 0) ?? getDefaultSettings(GlobalOgameMetaData.language as LanguageKey);

        this._resolveReady();
    }

    private async onMessage(msg: Message) {
        const { type, ogameMeta } = msg;
        if (!ogameMetasEqual(ogameMeta, GlobalOgameMetaData)) {
            return;
        }

        if (msg.senderUuid == statsViewUuid) {
            return;
        }

        switch (type) {
            case MessageType.NotifySettingsUpdate: {
                await this.loadData();
                break;
            }
        }
    }
}

export const SettingsDataModule = new SettingsDataModuleClass();