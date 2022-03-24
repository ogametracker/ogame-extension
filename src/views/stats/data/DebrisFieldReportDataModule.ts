import { DebrisFieldReport } from '@/shared/models/debris-field-reports/DebrisFieldReport';
import { MessageType } from '@/shared/messages/MessageType';
import { AllDebrisFieldReportsMessage, NewDebrisFieldReportMessage, RequestDebrisFieldReportsMessage } from '@/shared/messages/tracking/debris-fields';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './GlobalOgameMetaData';
import { Component, Vue } from 'vue-property-decorator';
import { startOfDay } from 'date-fns';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { IDataModule } from './IDataModule';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { Lock } from 'semaphore-async-await';

@Component
class DebrisFieldReportDataModuleClass extends Vue implements IDataModule {
    public reports: DebrisFieldReport[] = [];
    public reportsPerDay: Record<number, DebrisFieldReport[]> = {};
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
        console.log('connecting to background service');

        chrome.runtime.onMessage.addListener(message => this.onMessage(message));
    }

    private async requestData() {
        const message: RequestDebrisFieldReportsMessage = {
            type: MessageType.RequestDebrisFieldReports,
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
        case MessageType.NewDebrisFieldReport: {
            const { data } = msg as NewDebrisFieldReportMessage;
            this.reports = this.reports.concat(data);

            const day = startOfDay(data.date).getTime();
            const inDay = this.reportsPerDay[day] ?? [];
            inDay.push(data);
            this.reportsPerDay[day] = inDay;
            break;
        }

        case MessageType.AllDebrisFieldReports: {
            const { data } = msg as AllDebrisFieldReportsMessage;
            this.reports = data;
            this.reportsPerDay = data.reduce(
                (perDay, report) => {
                    const day = startOfDay(report.date).getTime();
                    perDay[day] ??= [];
                    perDay[day].push(report);
                    return perDay;
                },
                    {} as Record<number, DebrisFieldReport[]>
            );

            this.firstDate = data.reduce(
                (date, report) => Math.min(date ?? report.date, report.date),
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

export const DebrisFieldReportDataModule = new DebrisFieldReportDataModuleClass();