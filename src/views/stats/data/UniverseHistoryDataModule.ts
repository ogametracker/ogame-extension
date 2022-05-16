import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './GlobalOgameMetaData';
import { Component, Vue } from 'vue-property-decorator';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { RequestUniverseHistoryMessage, UniverseHistoryDataMessage } from '@/shared/messages/tracking/universe-history';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { UniverseHistory } from '@/shared/models/universe-history/UniverseHistory';

@Component
class UniverseHistoryDataModuleClass extends Vue  {
    public history: UniverseHistory | null = null;

    private async created() {
        this.initCommunication();
        await this.requestData();
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
                break;
            }
        }
    }
}

export const UniverseHistoryDataModule = new UniverseHistoryDataModuleClass();