import ExpoModule from "@/store/modules/ExpoModule";
import xlsx from 'xlsx';
import i18n from '@/i18n/';
import ExpoType from "@/models/expeditions/ExpoType";
import { add, startOfDay } from "date-fns";
import ExpoEvent, { ExpoEventDarkMatter, ExpoEventFleet, ExpoEventItem, ExpoEventResources, ExpoFindableShips, ExpoSizeableEvent } from "@/models/expeditions/ExpoEvent";
import Resource from "@/models/Resource";
import Items from "@/models/items";
import ExpoSize from "@/models/expeditions/ExpoSize";
import getNumericEnumValues from "@/utils/getNumericEnumValues";
import BattleModule from "@/store/modules/BattleModule";
import BattleReport from "@/models/battles/BattleReport";
import DebrisFieldReport from "@/models/debrisFields/DebrisFieldReport";
import DebrisFieldModule from "@/store/modules/DebrisFieldModule";

interface ExportHelper {
    label: string;
    getExpoData?: (data: ExpoData) => any[];
    getBattlesData?: (data: BattlesData) => any[];
    getDebrisFieldsData?: (data: DebrisFieldData) => any[];
}

interface ExpoData {
    exposByDay: {
        [key: number]: ExpoEvent[] | undefined;
    };
    days: Date[];
}

interface BattlesData {
    reportsByDay: {
        [key: number]: BattleReport[] | undefined;
    };
    days: Date[];
}

interface DebrisFieldData {
    reportsByDay: {
        [key: number]: DebrisFieldReport[] | undefined;
    };
    days: Date[];
}

class ExcelExport {
    private readonly expoExports: ExportHelper[] = [{
        label: 'Übersicht', //TODO: localization
        getExpoData: this.exportExpoOverview,
    }, {
        label: 'Rohstofffunde', //TODO: localization
        getExpoData: this.exportExpoResources,
    }, {
        label: 'Flottenfunde', //TODO: localization
        getExpoData: this.exportExpoFleet,
    }, {
        label: 'DM-Funde', //TODO: localization
        getExpoData: this.exportExpoDarkMatter,
    }, {
        label: 'Itemfunde', //TODO: localization
        getExpoData: this.exportExpoItems,
    }, {
        label: 'Rohdaten', //TODO: localization
        getExpoData: this.exportExposRaw,
    }];

    private readonly battlesExports: ExportHelper[] = [{
        label: 'Übersicht', //TODO: localization
        getBattlesData: this.exportBattlesOverview,
    }, {
        label: 'Rohstoffe', //TODO: localization
        getBattlesData: this.exportBattlesResources,
    }, {
        label: 'Verl. Schiffe (Sp.)', //TODO: localization
        getBattlesData: this.exportBattlesLostShipsPlayers,
    }, {
        label: 'Verl. Schiffe (Exp.)', //TODO: localization
        getBattlesData: this.exportBattlesLostShipsExpos,
    }, {
        label: 'Rohdaten', //TODO: localization
        getBattlesData: this.exportBattlesRaw,
    }];

    private readonly debrisFieldExports: ExportHelper[] = [{
        label: 'Rohstoffe', //TODO: localization
        getDebrisFieldsData: this.exportDebrisFieldsResources,
    }, {
        label: 'Rohdaten', //TODO: localization
        getDebrisFieldsData: this.exportDebrisFieldsRaw,
    }];


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
            ...expoTypes.map(expoType => i18n.messages.ogame.expoTypes[expoType]),
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
            ...resources.map(resource => i18n.messages.ogame.resources[resource]),
        ];

        return [headers, ...data];
    }

    private exportExpoFleet(expoData: ExpoData): any[] {
        const ships = getNumericEnumValues<ExpoFindableShips>(ExpoFindableShips);

        const data = expoData.days.map(day => [
            day,
            ...ships.map(ship => ((expoData.exposByDay[day.getTime()] ?? [])
                .filter(expo => expo.type == ExpoType.fleet) as ExpoEventFleet[])
                .reduce((acc, cur) => acc + (cur.fleet[ship] ?? 0), 0)
            ),
        ]);

        const headers = [
            '',
            ...ships.map(ship => i18n.messages.ogame.ships[ship]),
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
            i18n.messages.ogame.premium.darkMatter,
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
        const expos = Object.values(expoData.exposByDay ?? {})
            .flatMap(expos => expos ?? [])
            .sort((a, b) => a.date - b.date);

        const data = expos.map(expo => [
            new Date(expo.date),
            i18n.messages.ogame.expoTypes[expo.type],

            ...Object.keys(Resource).map(resource => expo.type == ExpoType.resources ? expo.resources[resource as Resource] : 0),

            ...getNumericEnumValues<ExpoFindableShips>(ExpoFindableShips)
                .map(ship => expo.type == ExpoType.fleet ? (expo.fleet[ship] ?? 0) : 0),

            (expo.type == ExpoType.darkMatter ? expo.darkMatter : 0),

            ((expo as ExpoSizeableEvent | { size: undefined }).size != null
                ? i18n.messages.ogame.expoSizes[(expo as ExpoSizeableEvent | { size: ExpoSize }).size]
                : ''),

            (expo.type == ExpoType.item ? Items[expo.itemHash].name : ''),
        ]);

        const headers = [
            'Datum + Zeit', //TODO: localization
            'Typ', //TODO: localization

            ...Object.keys(Resource).map(resource => i18n.messages.ogame.resources[resource]),

            ...getNumericEnumValues<ExpoFindableShips>(ExpoFindableShips)
                .map(ship => i18n.messages.ogame.ships[ship]),

            i18n.messages.ogame.premium.darkMatter,
            'Fundgröße', //TODO: localization
            'Item', //TODO: localization
        ];

        return [headers, ...data];
    }

    private get expoData() {
        const exposByDay = ExpoModule.byDay;
        const firstDay = Object.keys(exposByDay).map(x => parseInt(x)).sort((a, b) => a - b)[0];
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

    private exportExpos(workbook: xlsx.WorkBook) {
        const expoData = this.expoData;
        this.expoExports.forEach(exp => {
            const data = exp.getExpoData!(expoData);
            const sheet = xlsx.utils.aoa_to_sheet(data);

            xlsx.utils.book_append_sheet(workbook, sheet, 'Expeditionen - ' + exp.label); //TODO: localization
        });
    }

    private get battlesData() {
        const reportsByDay = BattleModule.byDay;
        const firstDay = Object.keys(reportsByDay).map(x => parseInt(x)).sort((a, b) => a - b)[0];
        const today = startOfDay(new Date());
        const days = [];
        let cur = startOfDay(firstDay);
        while (cur <= today) {
            days.push(cur);
            cur = add(cur, { days: 1 });
        }

        return {
            reportsByDay,
            days,
        };
    }

    private exportBattles(workbook: xlsx.WorkBook) {
        return;
        const battlesData = this.battlesData;
        this.battlesExports.forEach(exp => {
            const data = exp.getBattlesData!(battlesData);
            const sheet = xlsx.utils.aoa_to_sheet(data);

            xlsx.utils.book_append_sheet(workbook, sheet, 'Kämpfe - ' + exp.label); //TODO: localization
        });
    }

    private exportDebrisFieldsResources(debrisData: DebrisFieldData): any[] {
        const data = debrisData.days.map(day => [
            day,
            (debrisData.reportsByDay[day.getTime()] ?? [])
                .reduce((acc, cur) => acc + cur.metal, 0),
            (debrisData.reportsByDay[day.getTime()] ?? [])
                .reduce((acc, cur) => acc + cur.crystal, 0),
        ]);

        const headers = [
            '',
            i18n.messages.ogame.resources.metal,
            i18n.messages.ogame.resources.crystal,
        ];

        return [headers, ...data];
    }

    private exportDebrisFieldsRaw(debrisData: DebrisFieldData): any[] {
        const reports = Object.values(debrisData.reportsByDay ?? {})
            .flatMap(report => report ?? [])
            .sort((a, b) => a.date - b.date);

        const data = reports.map(report => [
            new Date(report.date),
            report.metal,
            report.crystal,
        ]);

        const headers = [
            'Datum + Zeit', //TODO: localization
            i18n.messages.ogame.resources.metal,
            i18n.messages.ogame.resources.crystal,
        ];

        return [headers, ...data];
    }

    private get debrisFieldsData() {
        const reportsByDay = DebrisFieldModule.byDay;
        const firstDay = Object.keys(reportsByDay).map(x => parseInt(x)).sort((a, b) => a - b)[0];
        const today = startOfDay(new Date());
        const days = [];
        let cur = startOfDay(firstDay);
        while (cur <= today) {
            days.push(cur);
            cur = add(cur, { days: 1 });
        }

        return {
            reportsByDay,
            days,
        };
    }

    private exportDebrisFields(workbook: xlsx.WorkBook) {
        const debrisData = this.debrisFieldsData;
        this.debrisFieldExports.forEach(exp => {
            const data = exp.getDebrisFieldsData!(debrisData);
            const sheet = xlsx.utils.aoa_to_sheet(data);

            xlsx.utils.book_append_sheet(workbook, sheet, 'Trümmerfelder - ' + exp.label); //TODO: localization
        });
    }

    public export() {
        const workbook = xlsx.utils.book_new();

        this.exportExpos(workbook);
        this.exportBattles(workbook);
        this.exportDebrisFields(workbook);

        xlsx.writeFile(workbook, 'OGame Tracking.xlsx');
    }
}

export default new ExcelExport();