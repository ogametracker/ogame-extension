import { Component, Vue } from 'vue-property-decorator';
import WreckfieldReport from "@/models/wreckfields/WreckfieldReport";
import { startOfDay } from 'date-fns';

@Component({})
class WreckfieldModule extends Vue {
    public readonly reports: WreckfieldReport[] = [];

    private async created() {
        this.reports.push({
            date: Date.now() - 24 * 60 * 60 * 1000,
            crystal: 1150000,
            metal: 3000000,
        }, {
            date: Date.now() - 24 * 60 * 60 * 1000,
            crystal: 115000,
            metal: 3000000,
        }, {
            date: Date.now(),
            crystal: 11500,
            metal: 30000,
        }, {
            date: Date.now(),
            crystal: 115000,
            metal: 3000000,
        });
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
}

export default new WreckfieldModule();