import { DebrisFieldReport } from '@/shared/models/debris-field-reports/DebrisFieldReport';
import { MessageType } from '@/shared/messages/MessageType';
import { NewDebrisFieldReportMessage } from '@/shared/messages/tracking/debris-fields';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { startOfDay } from 'date-fns';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@/shared/db/access';

export interface DailyDebrisFieldReportResult {
    metal: number;
    crystal: number;
}

@Component
class DebrisFieldReportDataModuleClass extends Vue {
    public dailyResults: Partial<Record<number, DailyDebrisFieldReportResult>> = {};
    private _firstDate: number | null = null;
    private _count = 0;

    public get count() {
        return this._count;
    }

    private async created() {
        this.initCommunication();
        await this.loadData();
    }

    private async loadData() {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const tx = db.transaction('debrisFieldReports', 'readonly');
        const store = tx.objectStore('debrisFieldReports');

        let minDate: number | null = null;
        let cursor = await store.openCursor();
        while (cursor != null) {
            const report = cursor.value;
            this.addDebrisFieldReportToDailyResult(report);

            minDate = Math.min(minDate ?? Number.MAX_SAFE_INTEGER, report.date);

            cursor = await cursor.continue();
        }
        this._firstDate = minDate;

        await tx.done;
    }
    
    private addDebrisFieldReportToDailyResult(report: DebrisFieldReport) {
         this._count++;

        const day = startOfDay(report.date).getTime();

        let dailyResult = this.dailyResults[day];
        if (dailyResult == null) {
            dailyResult = this.getNewDailyResult();
            this.$set(this.dailyResults, day, dailyResult);
        }

        dailyResult.metal += report.metal;
        dailyResult.crystal += report.crystal;
    }
    
    private getNewDailyResult(): DailyDebrisFieldReportResult {
        return {
            metal: 0,
            crystal: 0,
        };
    }

    private initCommunication() {
        console.log('connecting to background service');

        chrome.runtime.onMessage.addListener(message => this.onMessage(message));
    }

    private onMessage(msg: Message) {
        const { type, ogameMeta } = msg;
        if (!ogameMetasEqual(ogameMeta, GlobalOgameMetaData)) {
            return;
        }

        switch (type) {
            case MessageType.NewDebrisFieldReport: {
                const { data } = msg as NewDebrisFieldReportMessage;
                this.addDebrisFieldReportToDailyResult(data);
                break;
            }
        }
    }

    public get firstDay(): number {
        return startOfDay(this._firstDate ?? Date.now()).getTime();
    }
}

export const DebrisFieldReportDataModule = new DebrisFieldReportDataModuleClass();