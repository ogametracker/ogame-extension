import { ExpeditionEvent } from '@/shared/models/expeditions/ExpeditionEvents';
import { MessageType } from '@/shared/messages/MessageType';
import { AllExpeditionsMessage, NewExpeditionMessage, RequestExpeditionEventsMessage } from '@/shared/messages/tracking/expeditions';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './GlobalOgameMetaData';
import { Component, Vue } from 'vue-property-decorator';
import { startOfDay } from 'date-fns';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { IDataModule } from './IDataModule';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { Lock } from 'semaphore-async-await';

@Component
class ExpeditionDataModuleClass extends Vue implements IDataModule {
    public expeditions: ExpeditionEvent[] = [];
    public expeditionsPerDay: Record<number, ExpeditionEvent[]> = {};
    public firstDate: number | null = null;

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
        const message: RequestExpeditionEventsMessage = {
            type: MessageType.RequestExpeditionEvents,
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
        case MessageType.NewExpedition: {
            const { data } = msg as NewExpeditionMessage;
            this.expeditions = this.expeditions.concat(data);

            const day = startOfDay(data.date).getTime();
            const inDay = this.expeditionsPerDay[day] ?? [];
            inDay.push(data);
            this.expeditionsPerDay[day] = inDay;
            break;
        }

        case MessageType.AllExpeditions: {
            const { data } = msg as AllExpeditionsMessage;
            this.expeditions = data;
            this.expeditionsPerDay = data.reduce(
                (perDay, expo) => {
                    const day = startOfDay(expo.date).getTime();
                    perDay[day] ??= [];
                    perDay[day].push(expo);
                    return perDay;
                },
                    {} as Record<number, ExpeditionEvent[]>
            );

            this.firstDate = data.reduce(
                (date, expo) => Math.min(date ?? expo.date, expo.date),
                    null as null | number
            );

            this.lock.release();
            break;
        }
        }
    }

    public get firstDay(): number {
        return startOfDay(this.firstDate ?? Date.now()).getTime();
    }
}

export const ExpeditionDataModule = new ExpeditionDataModuleClass();