import { PersistentCollectionDataManager } from '../PersistentData';
import { CombatReport } from '../../shared/models/v1/combat-reports/CombatReport';

export class CombatReportManager extends PersistentCollectionDataManager<CombatReport> {
    constructor(key: string) {
        super(key, 'battleReports');
    }
}