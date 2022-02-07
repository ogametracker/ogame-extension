import { DebrisFieldReport } from "../../shared/models/v1/debris-field-reports/DebrisFieldReport";
import { PersistentDataManager } from '../PersistentData';

export class DebrisFieldReportManager extends PersistentDataManager<DebrisFieldReport> {
    constructor(key: string) {
        super(key, 'debrisFieldReports');
    }
}