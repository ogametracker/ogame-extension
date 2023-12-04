import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { DenCapacityBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class OrbitalDenClass extends LifeformTechnology implements DenCapacityBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 25_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 20_000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 10_000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [{ type: LifeformBonusTypeId.DenCapacityBonus }];
    }
    
    public getDenCapacityBonus(level: number): number {
        const bonusPerLevel = 0.04; //4%
        return bonusPerLevel * level;
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.orbitalDen;
    }
}

export const OrbitalDen = new OrbitalDenClass();
