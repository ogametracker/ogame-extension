import { Cost } from "../../../common/Cost";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResourceProductionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class MagmaPoweredProductionClass extends LifeformTechnology implements ResourceProductionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 25_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 20_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 10_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 0,
            },
        });
    }
    
    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.magmaPoweredProduction;
    }

    public getProductionBonus(level: number): Cost {
        const bonus = 0.00_08; // 0.08%

        return {
            metal: bonus * level,
            crystal: bonus * level,
            deuterium: bonus * level,
            energy: 0,
        };
    }
}

export const MagmaPoweredProduction = new MagmaPoweredProductionClass();