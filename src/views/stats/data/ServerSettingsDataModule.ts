import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './GlobalOgameMetaData';
import { Component, Vue } from 'vue-property-decorator';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { IDataModule } from './IDataModule';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { Lock } from 'semaphore-async-await';
import { ServerSettings } from '@/shared/models/server-settings/ServerSettings';
import { RequestServerSettingsMessage, ServerSettingsDataMessage } from '@/shared/messages/tracking/server-settings';

@Component
class ServerSettingsDataModuleClass extends Vue implements IDataModule {
    public serverSettings: ServerSettings = null!;
    private readonly lock = new Lock();

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
        chrome.runtime.onMessage.addListener(message => this.onMessage(message));
    }

    private async requestData() {
        const message: RequestServerSettingsMessage = {
            type: MessageType.RequestServerSettingsData,
            ogameMeta: GlobalOgameMetaData,
        };
        await broadcastMessage(message);
    }

    private onMessage(msg: Message) {
        const { type, ogameMeta } = msg;
        if (!ogameMetasEqual(ogameMeta, GlobalOgameMetaData, false)) {
            return;
        }

        switch (type) {
            case MessageType.ServerSettingsData:
            case MessageType.NotifyServerSettingsUpdate: {
                const { data } = msg as ServerSettingsDataMessage;
                this.serverSettings = data;

                this.lock.release();
                break;
            }
        }
    }
}

export const ServerSettingsDataModule = new ServerSettingsDataModuleClass();