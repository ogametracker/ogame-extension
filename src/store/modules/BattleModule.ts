import { Component, Vue } from 'vue-property-decorator';
import BattleReport from "@/models/battles/BattleReport";
import { startOfDay } from 'date-fns';
import BattleReportCollection from '@/models/battles/BattleReportCollection'; 

@Component({})
class BattleModule extends Vue {
    public readonly reports: BattleReport[] = [];

    public get reportsById(): BattleReportCollection {
        const reports: BattleReportCollection = {};
        this.reports.forEach(report => reports[report.id] = report);

        return reports;
    } 

    private async created() {
        //TODO: load from storage
    }

    public get firstReport(): BattleReport | null {
        return this.reports.reduce(
            (acc, cur) => acc == null || (acc.date > cur.date) ? cur : acc,
            null as BattleReport | null);
    }

    public get byDay() {
        return this.reports.reduce(
            (acc, report) => {
                const day = startOfDay(report.date).getTime();
                if (acc[day] == null) {
                    acc[day] = [];
                }
                acc[day]!.push(report);
                return acc;
            },
            {} as { [key: number]: BattleReport[] | undefined }
        );
    }

    public async save() {
        //TODO: save in chrome storage
    }

    public add(report: BattleReport) {
        this.reports.push(report);
    }
}

export default new BattleModule();