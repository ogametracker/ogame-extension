import { LocalPlayerData } from "../../shared/models/v1/empire/LocalPlayerData";
import { PersistentDataManager } from '../PersistentData';

export class EmpireManager extends PersistentDataManager<LocalPlayerData> {
    constructor(key: string) {
        super(key, 'local-player');
    }

    public async update(action: (data: LocalPlayerData) => LocalPlayerData): Promise<void> {
        await this._writeLock.acquire();
        
        const data = await this.load(false);
        const updatedData = action(data);

        await this.updateData(updatedData);

        this._readLock.release();
        this._writeLock.release();
    }
}