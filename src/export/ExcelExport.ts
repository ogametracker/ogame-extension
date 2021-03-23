import ExpoModule from "@/store/modules/ExpoModule";
import xlsx from 'xlsx';

interface ExportHelper {
    label: string;
    getData: () => any[];
    getHeaders: () => string[];
}

class ExcelExport {
    private readonly expoExports: ExportHelper[] = [{
        label: 'Übersicht',
        getData: this.exportExpoOverview,
        getHeaders: () => []
    }];

    private readonly attackExports: ExportHelper[] = [];

    private readonly tfExports: ExportHelper[] = [];


    private exportExpoOverview(): any[] {
        const expos = ExpoModule.expos;
        return [];
    }

    public export() {
        const expos = ExpoModule.expos;

        //TODO: export all total tables as their own sheet
        //TODO: export raw data as own sheet

        const workbook = xlsx.utils.book_new();
        this.expoExports.forEach(exp => {
            const data = exp.getData();
            const headers = exp.getHeaders();
            const sheet = xlsx.utils.json_to_sheet(data, { header: headers });

            xlsx.utils.book_append_sheet(workbook, sheet, 'Expeditionen - ' + exp.label);
        });

        xlsx.writeFile(workbook, 'OGame Tracking.xlsx');
    }
}

export default new ExcelExport();