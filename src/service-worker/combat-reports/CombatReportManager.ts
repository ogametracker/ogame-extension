import { PersistentCollectionDataManager } from '../PersistentData';
import { CombatReport } from '../../shared/models/combat-reports/CombatReport';

export class CombatReportManager extends PersistentCollectionDataManager<CombatReport> {
    constructor(key: string) {
        super(key, 'battleReports');
    }
}