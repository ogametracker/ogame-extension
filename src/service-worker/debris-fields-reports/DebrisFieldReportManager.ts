import { DebrisFieldReport } from "../../shared/models/debris-field-reports/DebrisFieldReport";
import { PersistentCollectionDataManager } from '../PersistentData';

export class DebrisFieldReportManager extends PersistentCollectionDataManager<DebrisFieldReport> {
    constructor(key: string) {
        super(key, 'debrisFieldReports');
    }
}