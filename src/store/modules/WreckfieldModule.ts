import { Component, Vue } from 'vue-property-decorator';
import WreckfieldReport from "@/models/wreckfields/WreckfieldReport";
import { startOfDay } from 'date-fns';

@Component({})
class WreckfieldModule extends Vue {
    public readonly reports: WreckfieldReport[] = [];

    private async created() {
        //TODO: 
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