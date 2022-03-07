import { DebrisFieldReport } from '@/shared/models/v1/debris-field-reports/DebrisFieldReport';
import { MessageType } from '@/shared/messages/MessageType';
import { AllDebrisFieldReportsMessage, NewDebrisFieldReportMessage, RequestDebrisFieldReportsMessage } from '@/shared/messages/tracking/debris-fields';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './GlobalOgameMetaData';
import { Component, Vue } from 'vue-property-decorator';
import { startOfDay } from 'date-fns';
import { broadcastMessage } from '@/shared/communication/broadcastMessage';
import { IDataModule } from './IDataModule';

@Component
class DebrisFieldReportDataModuleClass extends Vue implements IDataModule {
    public reports: DebrisFieldReport[] = [];
    public reportsPerDay: Record<number, DebrisFieldReport[]> = {};
    public firstDate: number | null = null;

    private async created() {
        this.initCommunication();

        await this.requestData();
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
        const message: RequestDebrisFieldReportsMessage = {
            type: MessageType.RequestDebrisFieldReports,
            ogameMeta: GlobalOgameMetaData,
        };
        await broadcastMessage(message);
    }

    private onMessage(msg: Message) {
        const { type } = msg;

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

                this._loaded = true;
                break;
            }
        }
    }

    public get firstDay(): number {
        return startOfDay(this.firstDate ?? Date.now()).getTime();
    }
}

export const DebrisFieldReportDataModule = new DebrisFieldReportDataModuleClass();