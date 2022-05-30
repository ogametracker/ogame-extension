import { LocalPlayerData } from '@/shared/models/empire/LocalPlayerData';
import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData, statsViewUuid } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { EmpireDataMessage, RequestLocalPlayerDataMessage } from '@/shared/messages/tracking/empire';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';

@Component
class EmpireDataModuleClass extends Vue {
    public empire: LocalPlayerData | null = null;

    private async created() {
        this.initCommunication();
        await this.requestData();
    }

    private initCommunication() {
        console.log('connecting to background service');

        chrome.runtime.onMessage.addListener(message => this.onMessage(message));
    }

    private async requestData() {
        const message: RequestLocalPlayerDataMessage = {
            type: MessageType.RequestEmpireData,
            ogameMeta: GlobalOgameMetaData,
            senderUuid: statsViewUuid,
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
                break;
            }
        }
    }
}

export const EmpireDataModule = new EmpireDataModuleClass();