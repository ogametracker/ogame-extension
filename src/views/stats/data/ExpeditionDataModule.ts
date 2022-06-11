import { ExpeditionEvent } from '@/shared/models/expeditions/ExpeditionEvents';
import { MessageType } from '@/shared/messages/MessageType';
import { NewExpeditionMessage } from '@/shared/messages/tracking/expeditions';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { startOfDay } from 'date-fns';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@/shared/db/access';

@Component
class ExpeditionDataModuleClass extends Vue {
    public expeditions: ExpeditionEvent[] = [];
    public expeditionsPerDay: Record<number, ExpeditionEvent[]> = {};
    public firstDate: number | null = null;

    private async created() {
        this.initCommunication();
        await this.loadData();
    }

    private async loadData() {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const expeditions = await db.getAll('expeditions');

        this.expeditions = expeditions;
        this.expeditionsPerDay = expeditions.reduce(
            (perDay, expo) => {
                const day = startOfDay(expo.date).getTime();
                perDay[day] ??= [];
                perDay[day].push(expo);
                return perDay;
            },
            {} as Record<number, ExpeditionEvent[]>
        );

        this.firstDate = expeditions.reduce(
            (date, expo) => Math.min(date ?? expo.date, expo.date),
            null as null | number
        );
    }

    private initCommunication() {
        chrome.runtime.onMessage.addListener(message => this.onMessage(message));
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
        }
    }

    public get firstDay(): number {
        return startOfDay(this.firstDate ?? Date.now()).getTime();
    }
}

export const ExpeditionDataModule = new ExpeditionDataModuleClass();