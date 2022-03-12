import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './GlobalOgameMetaData';
import { Component, Vue } from 'vue-property-decorator';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { IDataModule } from './IDataModule';
import { Settings } from '@/shared/models/v1/settings/Settings';
import { RequestSettingsMessage, SettingsMessage } from '@/shared/messages/settings';

@Component
class SettingsDataModuleClass extends Vue implements IDataModule {
    public settings: Settings = null!;

    private resolveInitialDataPromise: (() => void) | null = null;

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
                if(!this._loaded) {
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
        const { type } = msg;

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