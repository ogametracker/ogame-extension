import { ExpeditionEvent } from "../../shared/models/v1/expeditions/ExpeditionEvents";
import { PersistentDataManager } from '../PersistentData';

export class ExpeditionManager extends PersistentDataManager<ExpeditionEvent> {
    constructor(key: string) {
        super(key, 'expoEvents');
    }
}