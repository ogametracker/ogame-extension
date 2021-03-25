import ExpoModule from "@/store/modules/ExpoModule";
import xlsx from 'xlsx';
import i18n from '@/i18n/vue-i18n';
import ExpoType from "@/models/expeditions/ExpoType";
import { add, startOfDay } from "date-fns";
import ExpoEvent, { ExpoEventDarkMatter, ExpoEventFleet, ExpoEventItem, ExpoEventResources, ExpoFindableShips, ExpoSizeableEvent } from "@/models/expeditions/ExpoEvent";
import Resource from "@/models/Resource";
import Items from "@/models/items";

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
    }, {
        label: 'Flottenfunde',
        getData: this.exportExpoFleet,
    }, {
        label: 'DM-Funde',
        getData: this.exportExpoDarkMatter,
    }, {
        label: 'Itemfunde',
        getData: this.exportExpoItems,
    }, {
        label: 'Rohdaten',
        getData: this.exportExposRaw,
    }];

    private readonly attackExports: ExportHelper[] = [];

    private readonly tfExports: ExportHelper[] = [];


    private exportExpoOverview(expoData: ExpoData): any[] {
        const expoTypes = Object.keys(ExpoType);

        const data = expoData.days.map(day => [
            day,
            ...expoTypes.map(expoType => (expoData.exposByDay[day.getTime()] ?? [])
                .filter(expo => expo.type == expoType)
                .length
            ),
        ]);

        const headers = [
            '',
            ...expoTypes.map(expoType => i18n.t(`ogame.expoTypes['${expoType}']`) as string),
        ];


        return [headers, ...data];
    }

    private exportExpoResources(expoData: ExpoData): any[] {
        const resources = [Resource.metal, Resource.crystal, Resource.deuterium];

        const data = expoData.days.map(day => [
            day,
            ...resources.map(resource => ((expoData.exposByDay[day.getTime()] ?? [])
                .filter(expo => expo.type == ExpoType.resources) as ExpoEventResources[])
                .reduce((acc, cur) => acc + cur.resources[resource], 0)
            ),
        ]);

        const headers = [
            '',
            ...resources.map(resource => i18n.t(`ogame.resources['${resource}']`) as string),
        ];

        return [headers, ...data];
    }

    private exportExpoFleet(expoData: ExpoData): any[] {
        const ships = Object.keys(ExpoFindableShips) as unknown[] as ExpoFindableShips[];

        const data = expoData.days.map(day => [
            day,
            ...ships.map(ship => ((expoData.exposByDay[day.getTime()] ?? [])
                .filter(expo => expo.type == ExpoType.fleet) as ExpoEventFleet[])
                .reduce((acc, cur) => acc + cur.fleet[ship], 0)
            ),
        ]);

        const headers = [
            '',
            ...ships.map(ship => i18n.t(`ogame.ships['${ship}']`) as string),
        ];

        return [headers, ...data];
    }

    private exportExpoDarkMatter(expoData: ExpoData): any[] {
        const data = expoData.days.map(day => [
            day,
            ((expoData.exposByDay[day.getTime()] ?? [])
                .filter(expo => expo.type == ExpoType.darkMatter) as ExpoEventDarkMatter[])
                .reduce((acc, cur) => acc + cur.darkMatter, 0),
        ]);

        const headers = [
            '',
            i18n.t(`ogame.premium.darkMatter`),
        ];

        return [headers, ...data];
    }

    private exportExpoItems(expoData: ExpoData): any[] {
        const data = expoData.days.map(day => [
            day,
            ((expoData.exposByDay[day.getTime()] ?? [])
                .filter(expo => expo.type == ExpoType.item) as ExpoEventItem[])
                .map(itemExpo => Items[itemExpo.itemHash].name)
                .join('\n'),
        ]);

        const headers = ['', 'Item'];

        return [headers, ...data];
    }

    private exportExposRaw(expoData: ExpoData): any[] {
        const expos = Object.values(expoData.exposByDay)
            .flatMap(expos => expos ?? [])
            .sort((a,b) => a.date - b.date);

        const data = expos.map(expo => [
            new Date(expo.date),
            i18n.t(`ogame.expoTypes['${expo.type}']`) as string,

            ...Object.keys(Resource).map(resource => expo.type == ExpoType.resources ? expo.resources[resource as Resource] : 0),
            ...Object.keys(ExpoFindableShips).map(ship => expo.type == ExpoType.fleet ? (expo.fleet[ship as unknown as ExpoFindableShips] ?? 0) : 0),
            (expo.type == ExpoType.darkMatter ? expo.darkMatter : 0),
            ((expo as ExpoSizeableEvent | {size: undefined}).size != null ? i18n.t(`ogame.expoSizes['${(expo as ExpoSizeableEvent | {size: undefined}).size}']`) : ''),
            (expo.type == ExpoType.item ? Items[expo.itemHash].name : ''),
        ]);

        const headers = [
            'Datum + Zeit', 
            'Typ',
            ...Object.keys(Resource).map(resource => i18n.t(`ogame.resources['${resource}']`) as string),
            ...Object.keys(ExpoFindableShips).map(ship => i18n.t(`ogame.ships['${ship}']`) as string),
            i18n.t('ogame.premium.darkMatter') as string,
            'Fundgröße',
            'Item',
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