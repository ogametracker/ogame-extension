import { PersistentDataManager } from '../PersistentData';
import { CombatReport } from '../../shared/models/v1/combat-reports/CombatReport';

export class CombatReportManager extends PersistentDataManager<CombatReport> {
    constructor(key: string) {
        super(key, 'battleReports');
    }
}