import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData, statsViewUuid } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { ServerSettings } from '@/shared/models/server-settings/ServerSettings';
import { RequestServerSettingsMessage, ServerSettingsDataMessage } from '@/shared/messages/tracking/server-settings';

@Component
class ServerSettingsDataModuleClass extends Vue {
    public serverSettings: ServerSettings | null = null;

    private async created() {
        this.initCommunication();
        await this.requestData();
    }

    private initCommunication() {
        chrome.runtime.onMessage.addListener(message => this.onMessage(message));
    }

    private async requestData() {
        const message: RequestServerSettingsMessage = {
            type: MessageType.RequestServerSettingsData,
            ogameMeta: GlobalOgameMetaData,
            senderUuid: statsViewUuid,
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
                break;
            }
        }
    }
}

export const ServerSettingsDataModule = new ServerSettingsDataModuleClass();