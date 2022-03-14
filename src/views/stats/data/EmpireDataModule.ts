import { LocalPlayerData } from '@/shared/models/empire/LocalPlayerData';
import { MessageType } from '@/shared/messages/MessageType';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './GlobalOgameMetaData';
import { Component, Vue } from 'vue-property-decorator';
import { startOfDay } from 'date-fns';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { EmpireDataMessage, RequestLocalPlayerDataMessage } from '@/shared/messages/tracking/empire';
import { IDataModule } from './IDataModule';

@Component
class EmpireDataModuleClass extends Vue implements IDataModule {
    public empire: LocalPlayerData = null!;

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
        const message: RequestLocalPlayerDataMessage = {
            type: MessageType.RequestEmpireData,
            ogameMeta: GlobalOgameMetaData,
        };
        await broadcastMessage(message);
    }

    private onMessage(msg: Message) {
        const { type } = msg;

        switch (type) {
            case MessageType.EmpireData:
            case MessageType.NotifyEmpireDataUpdate: {
                this.resolveInitialDataPromise?.();

                const { data } = msg as EmpireDataMessage;
                this.empire = data;

                this._loaded = true;
                break;
            }
        }
    }
}

export const EmpireDataModule = new EmpireDataModuleClass();