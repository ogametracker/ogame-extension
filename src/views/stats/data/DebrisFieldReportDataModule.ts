import { DebrisFieldReport } from '@/shared/models/debris-field-reports/DebrisFieldReport';
import { MessageType } from '@/shared/messages/MessageType';
import { NewDebrisFieldReportMessage } from '@/shared/messages/tracking/debris-fields';
import { Message, MessageOgameMeta } from '@/shared/messages/Message';
import { GlobalOgameMetaData } from './global';
import { Component, Vue } from 'vue-property-decorator';
import { startOfDay } from 'date-fns';
import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
import { getPlayerDatabase } from '@/shared/db/access';
import { UniversesAndAccountsDataModule } from './UniversesAndAccountsDataModule';
import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';

export type DebrisFieldResources = Record<ResourceType, number>;

export interface DailyDebrisFieldReportResult {
    date: number;
    total: DebrisFieldResources;
    normal: DebrisFieldResources;
    expedition: DebrisFieldResources;
}

@Component
class DebrisFieldReportDataModuleClass extends Vue {
    public dailyResults: Partial<Record<number, DailyDebrisFieldReportResult>> = {};
    private internal_firstDate: number | null = null;
    private internal_count = 0;
    private internal_minId = 0;

    private _ready!: Promise<void>;
    private _resolveReady!: () => void;

    public get ready(): Promise<void> {
        return this._ready;
    }

    public get minId() {
        return this.internal_minId;
    }

    public get count() {
        return this.internal_count;
    }

    public get dailyResultsArray(): DailyDebrisFieldReportResult[] {
        return Object.values(this.dailyResults) as DailyDebrisFieldReportResult[];
    }

    private async created() {
        this._ready = new Promise<void>(resolve => this._resolveReady = resolve);

        this.initCommunication();
        await this.loadData();
    }

    private async loadData() {
        await this.$nextTick();
        await UniversesAndAccountsDataModule.ready;

        const la = UniversesAndAccountsDataModule.currentAccount.linkedAccounts ?? [];
        const linkedAccounts = la.map<MessageOgameMeta>(acc => ({
            playerId: acc.id,
            language: acc.serverLanguage,
            serverId: acc.serverId,
            userLanguage: 'doesnt-matter',
        }));
        const accounts: MessageOgameMeta[] = [
            GlobalOgameMetaData,
            ...linkedAccounts,
        ];

        let minDate: number | null = null;
        for (const account of accounts) {
            const db = await getPlayerDatabase(account);
            
            const reports = await db.getAll('debrisFieldReports');
            reports.forEach(report => {
                this.addDebrisFieldReportToDailyResult(report);
                
                minDate = Math.min(minDate ?? Number.MAX_SAFE_INTEGER, report.date);
            });
            this.internal_firstDate = minDate;
        }

        this._resolveReady();
    }

    private addTimeout: number | undefined = undefined;
    private addReports: DebrisFieldReport[] = [];

    private addDebrisFieldReportToDailyResult_delayed(report: DebrisFieldReport) {
        this.addReports.push(report);

        clearTimeout(this.addTimeout);
        this.addTimeout = setTimeout(() => {
            const addReports = this.addReports;
            this.addReports = [];
            addReports.forEach(report => this.addDebrisFieldReportToDailyResult(report));
        }, 500);
    }

    private addDebrisFieldReportToDailyResult(report: DebrisFieldReport) {
        this.internal_count++;

        const day = startOfDay(report.date).getTime();

        let dailyResult = this.dailyResults[day];
        if (dailyResult == null) {
            dailyResult = this.getNewDailyResult(day);
            this.$set(this.dailyResults, day, dailyResult);
        }

        dailyResult.total.metal += report.metal;
        dailyResult.total.crystal += report.crystal;
        dailyResult.total.deuterium += report.deuterium ?? 0;

        if (report.isExpeditionDebrisField) {
            dailyResult.expedition.metal += report.metal;
            dailyResult.expedition.crystal += report.crystal;
            dailyResult.expedition.deuterium += report.deuterium ?? 0;
        } 
        else {
            dailyResult.normal.metal += report.metal;
            dailyResult.normal.crystal += report.crystal;
            dailyResult.normal.deuterium += report.deuterium ?? 0;
        }

        this.internal_minId = Math.min(this.internal_minId, report.id);
    }

    private getNewDailyResult(date: number): DailyDebrisFieldReportResult {
        return {
            date,
            total: {
                metal: 0,
                crystal: 0,
                deuterium: 0,
            },
            normal: {
                metal: 0,
                crystal: 0,
                deuterium: 0,
            },
            expedition: {
                metal: 0,
                crystal: 0,
                deuterium: 0,
            },
        };
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
            case MessageType.NewDebrisFieldReport: {
                const { data } = msg as NewDebrisFieldReportMessage;
                this.addDebrisFieldReportToDailyResult_delayed(data);
                break;
            }
        }
    }

    public get firstDay(): number {
        return startOfDay(this.internal_firstDate ?? Date.now()).getTime();
    }

    public async clear(): Promise<void> {
        const db = await getPlayerDatabase(GlobalOgameMetaData);
        await db.clear('debrisFieldReports');
    }
}

export const DebrisFieldReportDataModule = new DebrisFieldReportDataModuleClass();