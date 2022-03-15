import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './GlobalOgameMetaData';
import { Component, Vue } from 'vue-property-decorator';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { IDataModule } from './IDataModule';
import { Settings } from '@/shared/models/settings/Settings';
import { RequestSettingsMessage, SettingsMessage, UpdateSettingsMessage } from '@/shared/messages/settings';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';

@Component
class SettingsDataModuleClass extends Vue implements IDataModule {
    public settings: Settings = null!;

    private resolveInitialDataPromise: (() => void) | null = null;

    public updateSettings(settings: Settings) {
        console.debug('updating settings', settings);

        const message: UpdateSettingsMessage = {
            type: MessageType.UpdateSettings,
            ogameMeta: GlobalOgameMetaData,
            data: settings,
        };
        broadcastMessage(message);

        this.settings = settings;
    }

    private async created() {
        await new Promise<void>(async resolve => {
            this.resolveInitialDataPromise = resolve;
            this.initCommunication();

            await this.requestData();
        });
    }

    private _loaded = false;

    public async load(): Promise<void> {
        await new Promise<void>(resolve => {
            const interval = setInterval(() => {
                if (!this._loaded) {
                    return;
                }

                clearInterval(interval);
                resolve();
            }, 10);
        });
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
                this.resolveInitialDataPromise?.();

                const { data: settings } = msg as SettingsMessage;
                this.settings = settings;

                this._loaded = true;
                break;
            }
        }
    }
}

export const SettingsDataModule = new SettingsDataModuleClass();