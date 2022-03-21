import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './GlobalOgameMetaData';
import { Component, Vue } from 'vue-property-decorator';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { RequestUniverseHistoryMessage, UniverseHistoryDataMessage } from '@/shared/messages/tracking/universe-history';
import { IDataModule } from './IDataModule';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { UniverseHistory } from '@/shared/models/universe-history/UniverseHistory';
import { Lock } from 'semaphore-async-await';

@Component
class UniverseHistoryDataModuleClass extends Vue implements IDataModule {
    public history: UniverseHistory = null!;
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
        const message: RequestUniverseHistoryMessage = {
            type: MessageType.RequestUniverseHistoryData,
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
            case MessageType.UniverseHistoryData:
            case MessageType.NotifyUniverseHistoryUpdate: {
                const { data } = msg as UniverseHistoryDataMessage;
                this.history = data;

                this.lock.release();
                break;
            }
        }
    }
}

export const UniverseHistoryDataModule = new UniverseHistoryDataModuleClass();