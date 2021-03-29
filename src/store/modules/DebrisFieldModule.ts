import { Component, Vue } from 'vue-property-decorator';
import DebrisFieldReport from "@/models/debrisFields/DebrisFieldReport";
import { startOfDay } from 'date-fns';
import DebrisFieldReportCollection from '@/models/debrisFields/DebrisFieldReportCollection';
import asyncChromeStorage from '@/utils/asyncChromeStorage';
import OgameMetaData from '@/models/ogame/OgameMetaData';

@Component({})
class DebrisFieldModule extends Vue {
    public readonly reports: DebrisFieldReport[] = [];

    public get reportsById(): DebrisFieldReportCollection {
        const reports: DebrisFieldReportCollection = {};
        this.reports.forEach(report => reports[report.id] = report);

        return reports;
    } 

    private async created() {
        const reportsById: DebrisFieldReportCollection = await asyncChromeStorage.get(this.storageKey) ?? {};
        this.reports.push(...Object.values(reportsById));
    }

    public get firstReport(): DebrisFieldReport | null {
        return this.reports.reduce(
            (acc, cur) => acc == null || (acc.date > cur.date) ? cur : acc,
            null as DebrisFieldReport | null);
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
            {} as { [key: number]: DebrisFieldReport[] | undefined }
        );
    }

    public get storageKey(): string {
        return `${OgameMetaData.storageKeyPrefix}-debrisFieldReports`;
    }

    public async save() {
        await asyncChromeStorage.set(this.storageKey, this.reportsById);
    }

    public add(report: DebrisFieldReport) {
        this.reports.push(report);
    }
}

export default new DebrisFieldModule();