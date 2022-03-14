import { LocalPlayerData } from "../../shared/models/v2/empire/LocalPlayerData";
import { AllianceClass } from "../../shared/models/v2/ogame/classes/AllianceClass";
import { PlayerClass } from "../../shared/models/v2/ogame/classes/PlayerClass";
import { ResearchType } from "../../shared/models/v2/ogame/research/ResearchType";
import { PersistentDataManager } from '../PersistentData';

export class EmpireManager extends PersistentDataManager<LocalPlayerData> {
    constructor(key: string) {
        super(key, 'local-player');
    }

    public async update(action: (data: LocalPlayerData) => LocalPlayerData): Promise<void> {
        const data = await this.load(false);
        const updatedData = action(data);
        this._readLock.release();

        await this.updateData(updatedData);
    }

    protected getDefaultItem(): LocalPlayerData {
        return {
            allianceClass: AllianceClass.none,
            officers: {
                admiral: false,
                commander: false,
                engineer: false,
                geologist: false,
                technocrat: false,
            },
            planets: {},
            playerClass: PlayerClass.none,
            research: {
                [ResearchType.energyTechnology]: 0,
                [ResearchType.laserTechnology]: 0,
                [ResearchType.ionTechnology]: 0,
                [ResearchType.hyperspaceTechnology]: 0,
                [ResearchType.plasmaTechnology]: 0,
                [ResearchType.combustionDrive]: 0,
                [ResearchType.impulseDrive]: 0,
                [ResearchType.hyperspaceDrive]: 0,
                
                [ResearchType.espionageTechnology]: 0,
                [ResearchType.computerTechnology]: 0,
                [ResearchType.astrophysics]: 0,
                [ResearchType.intergalacticResearchNetwork]: 0,
                [ResearchType.gravitonTechnology]: 0,
                [ResearchType.weaponsTechnology]: 0,
                [ResearchType.shieldingTechnology]: 0,
                [ResearchType.armorTechnology]: 0,
            },
        };
    }
}