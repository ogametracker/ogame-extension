import { ExpeditionEvent } from "../../shared/models/expeditions/ExpeditionEvents";
import { PersistentCollectionDataManager } from '../PersistentData';

export class ExpeditionManager extends PersistentCollectionDataManager<ExpeditionEvent> {
    constructor(key: string) {
        super(key, 'expoEvents');
    }
}