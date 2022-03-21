import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './GlobalOgameMetaData';
import { Component, Vue } from 'vue-property-decorator';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { RequestUniverseHistoryMessage, UniverseHistoryDataMessage } from '@/shared/messages/tracking/universe-history';
import { IDataModule } from './IDataModule';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { UniverseHistory } from '@/shared/models/universe-history/UniverseHistory';

@Component
class UniverseHistoryDataModuleClass extends Vue implements IDataModule {
    public history: UniverseHistory = null!;

    private resolveInitialDataPromise: (() => void) | null = null;

    private async created() {
        await new Promise<void>(async resolve => {
            this.resolveInitialDataPromise = resolve;
            this.initCommunication();

            await this.requestData();
        });
    }

    private loaded = false;

    public async load(): Promise<void> {
        await new Promise<void>(resolve => {
            const interval = setInterval(() => {
                if(!this.loaded) {
                    return;
                }

                clearInterval(interval);
                resolve();
            }, 10);
        });
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
                this.resolveInitialDataPromise?.();

                const { data } = msg as UniverseHistoryDataMessage;
                this.history = data;

                this.loaded = true;
                break;
            }
        }
    }
}

export const UniverseHistoryDataModule = new UniverseHistoryDataModuleClass();