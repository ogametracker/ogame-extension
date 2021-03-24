import ExpoModule from "@/store/modules/ExpoModule";
import xlsx from 'xlsx';
import i18n from '@/i18n/vue-i18n';
import ExpoType from "@/models/expeditions/ExpoType";
import { add, startOfDay } from "date-fns";
import ExpoEvent, { ExpoEventResources } from "@/models/expeditions/ExpoEvent";
import Resource from "@/models/Resource";

interface ExportHelper {
    label: string;
    getData: (data: ExpoData) => any[];
}

interface ExpoData {
    exposByDay: {
        [key: number]: ExpoEvent[] | undefined;
    };
    days: Date[];
}

class ExcelExport {
    private readonly expoExports: ExportHelper[] = [{
        label: 'Übersicht',
        getData: this.exportExpoOverview,
    }, {
        label: 'Rohstofffunde',
        getData: this.exportExpoResources,
    }];

    private readonly attackExports: ExportHelper[] = [];

    private readonly tfExports: ExportHelper[] = [];


    private exportExpoResources(expoData: ExpoData): any[] {
        const resources = [Resource.metal, Resource.crystal, Resource.deuterium];

        const data = expoData.days.map(day => [
            i18n.d(day, 'short'),
            ...resources.map(resource => ((expoData.exposByDay[day.getTime()] ?? [])
                .filter(expo => expo.type == ExpoType.resources) as ExpoEventResources[])
                .reduce((acc, cur) => acc + cur.resources[resource], 0)
            ),
        ]);

        const headers = [
            '',
            ...resources.map(resource => i18n.t(`resources['${resource}']`) as string),
        ];


        return [headers, ...data];
    }

    private exportExpoOverview(expoData: ExpoData): any[] {
        const expoTypes = Object.keys(ExpoType);

        const data = expoData.days.map(day => [
            i18n.d(day, 'short'),
            ...expoTypes.map(expoType => (expoData.exposByDay[day.getTime()] ?? [])
                .filter(expo => expo.type == expoType)
                .length
            ),
        ]);

        const headers = [
            '',
            ...expoTypes.map(expoType => i18n.t(`expoTypes['${expoType}']`) as string),
        ];


        return [headers, ...data];
    }

    private get expoData() {
        const exposByDay = ExpoModule.byDay;
        const firstDay = Object.keys(exposByDay).map(parseInt).sort((a, b) => a - b)[0];
        const today = startOfDay(new Date());
        const days = [];
        let cur = startOfDay(firstDay);
        while (cur <= today) {
            days.push(cur);
            cur = add(cur, { days: 1 });
        }

        return {
            exposByDay,
            days,
        };
    }

    public export() {
        //TODO: export raw data as own sheet

        const expoData = this.expoData;

        const workbook = xlsx.utils.book_new();
        this.expoExports.forEach(exp => {
            const data = exp.getData(expoData);
            const sheet = xlsx.utils.aoa_to_sheet(data);

            xlsx.utils.book_append_sheet(workbook, sheet, 'Expeditionen - ' + exp.label);
        });

        xlsx.writeFile(workbook, 'OGame Tracking.xlsx');
    }
}

export default new ExcelExport();