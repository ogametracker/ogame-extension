import { LocalPlayerData } from "../../shared/models/v1/empire/LocalPlayerData";
import { PersistentDataManager } from '../PersistentData';

export class EmpireManager extends PersistentDataManager<LocalPlayerData> {
    constructor(key: string) {
        super(key, 'local-player');
    }
}