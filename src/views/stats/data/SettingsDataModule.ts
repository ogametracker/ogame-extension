import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './GlobalOgameMetaData';
import { Component, Vue } from 'vue-property-decorator';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { Settings } from '@/shared/models/settings/Settings';
import { RequestSettingsMessage, SettingsMessage, UpdateSettingsMessage } from '@/shared/messages/settings';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { Lock } from 'semaphore-async-await';

@Component
class SettingsDataModuleClass extends Vue {
    public settings: Settings = null!;

    private readonly lock = new Lock();

    public async updateSettings(settings: Settings) {
        console.debug('updating settings', settings);

        const message: UpdateSettingsMessage = {
            type: MessageType.UpdateSettings,
            ogameMeta: GlobalOgameMetaData,
            data: settings,
        };
        await broadcastMessage(message);

        this.settings = settings;
    }

    private async created() {
        await this.lock.acquire();

        this.initCommunication();

        await this.requestData();
    }

    public async load(): Promise<void> {
        await this.lock.acquire();
        this.lock.release();
    }

    private initCommunication() {
        console.log('connecting to background service');

        chrome.runtime.onMessage.addListener(message => this.onMessage(message));
    }

    private async requestData() {
        const message: RequestSettingsMessage = {
            type: MessageType.RequestSettings,
            ogameMeta: GlobalOgameMetaData,
        };
        await broadcastMessage(message);
    }

    private onMessage(msg: Message) {
        const { type, ogameMeta } = msg;
        if (!ogameMetasEqual(ogameMeta, GlobalOgameMetaData)) {
            return;
        }

        switch (type) {
            case MessageType.Settings: {
                const { data: settings } = msg as SettingsMessage;
                this.settings = settings;

                this.lock.release();
                break;
            }
        }
    }
}

export const SettingsDataModule = new SettingsDataModuleClass();