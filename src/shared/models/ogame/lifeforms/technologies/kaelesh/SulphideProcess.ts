import { Cost } from "../../../common/Cost";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResourceProductionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class SulphideProcessClass extends LifeformTechnology implements ResourceProductionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 7_500,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 12_500,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 5_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 0,
            },
        });
    }
    
    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.sulphideProcess;
    }

    public getProductionBonus(level: number): Cost {
        const deutBonus = 0.00_08; // 0.08%

        return {
            metal: 0,
            crystal: 0,
            deuterium: deutBonus * level,
            energy: 0,
        };
    }
}

export const SulphideProcess = new SulphideProcessClass();