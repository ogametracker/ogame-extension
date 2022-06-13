import { CombatReport } from '@/shared/models/combat-reports/CombatReport';
import { MessageType } from '@/shared/messages/MessageType';
import { NewCombatReportMessage } from '@/shared/messages/tracking/combat-reports';
import { Message } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { startOfDay } from 'date-fns';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@/shared/db/access';

@Component
class CombatReportDataModuleClass extends Vue {
    public reports: CombatReport[] = [];
    public reportsPerDay: Record<number, CombatReport[]> = {};
    public firstDate: number | null = null;

    private async created() {
        this.initCommunication();
        await this.loadData();
    }

    private async loadData() {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        const reports = await db.getAll('combatReports');

        this.reports = reports;
        this.reportsPerDay = reports.reduce(
            (perDay, report) => {
                const day = startOfDay(report.date).getTime();
                perDay[day] ??= [];
                perDay[day].push(report);
                return perDay;
            },
            {} as Record<number, CombatReport[]>
        );

        this.firstDate = reports.reduce(
            (date, report) => Math.min(date ?? report.date, report.date),
            null as null | number
        );
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
            case MessageType.NewCombatReport: {
                const { data } = msg as NewCombatReportMessage;
                this.reports = this.reports.concat(data);

                const day = startOfDay(data.date).getTime();
                const inDay = this.reportsPerDay[day] ?? [];
                inDay.push(data);
                this.reportsPerDay[day] = inDay;
                break;
            }
        }
    }

    public get firstDay(): number {
        return startOfDay(this.firstDate ?? Date.now()).getTime();
    }
}

export const CombatReportDataModule = new CombatReportDataModuleClass();