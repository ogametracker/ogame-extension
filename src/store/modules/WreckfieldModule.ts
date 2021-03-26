import { Component, Vue } from 'vue-property-decorator';
import WreckfieldReport from "@/models/wreckfields/WreckfieldReport";
import { startOfDay } from 'date-fns';
import WreckfieldReportCollection from '@/models/wreckfields/WreckfieldReportCollection';

@Component({})
class WreckfieldModule extends Vue {
    public reportsById: WreckfieldReportCollection = {};
    public readonly reports: WreckfieldReport[] = [];

    private async created() {
        //TODO: load from storage
    }

    public get firstReport(): WreckfieldReport | null {
        return this.reports.reduce(
            (acc, cur) => acc == null || (acc.date > cur.date) ? cur : acc,
            null as WreckfieldReport | null);
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
            {} as { [key: number]: WreckfieldReport[] | undefined }
        );
    }

    public async save() {
        //TODO: save in chrome storage
    }

    public add(report: WreckfieldReport) {
        this.reportsById[report.id] = report;
        this.reports.push(report);
    }
}

export default new WreckfieldModule();