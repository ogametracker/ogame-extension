import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { CollectorClassBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class RocktalCollectorEnhancementClass extends LifeformTechnology implements CollectorClassBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 200_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 100_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 100_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 0,
            },
        });
    }
    
    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.rocktalCollectorEnhancement;
    }

    public getCollectorClassBonus(level: number): number {
        const bonus = 0.00_2; // 0.2%
        return bonus * level;
    }
}

export const RocktalCollectorEnhancement = new RocktalCollectorEnhancementClass();