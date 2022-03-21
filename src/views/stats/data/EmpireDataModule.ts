import { LocalPlayerData } from '@/shared/models/empire/LocalPlayerData';
import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './GlobalOgameMetaData';
import { Component, Vue } from 'vue-property-decorator';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { EmpireDataMessage, RequestLocalPlayerDataMessage } from '@/shared/messages/tracking/empire';
import { IDataModule } from './IDataModule';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { Lock } from 'semaphore-async-await';

@Component
class EmpireDataModuleClass extends Vue implements IDataModule {
    public empire: LocalPlayerData = null!;

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
        console.log('connecting to background service');

        chrome.runtime.onMessage.addListener(message => this.onMessage(message));
    }

    private async requestData() {
        const message: RequestLocalPlayerDataMessage = {
            type: MessageType.RequestEmpireData,
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
            case MessageType.EmpireData:
            case MessageType.NotifyEmpireDataUpdate: {
                const { data } = msg as EmpireDataMessage;
                this.empire = data;

                this.lock.release();
                break;
            }
        }
    }
}

export const EmpireDataModule = new EmpireDataModuleClass();