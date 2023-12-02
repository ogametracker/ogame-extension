import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";
import { SpaceDockBonusLifeformBuilding } from "../interfaces";

class NanoRepairBotsClass extends LifeformBuilding implements SpaceDockBonusLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 250_000,
                increaseFactor: 1.4,
            },
            crystal: {
                baseCost: 125_000,
                increaseFactor: 1.4,
            },
            deuterium: {
                baseCost: 125_000,
                increaseFactor: 1.4,
            },
            energy: {
                baseCost: 100,
                increaseFactor: 1.05,
            },
        });
    }
    
    public getSpaceDockBonus(level: number): number {
        const bonus = 0.01_3; // 1.3%
        return bonus * level;
    }

    public get bonuses(): LifeformBonusType[] {
        return [{ type: LifeformBonusTypeId.SpaceDockBonus }];
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.nanoRepairBots;
    }
}

export const NanoRepairBots = new NanoRepairBotsClass();
