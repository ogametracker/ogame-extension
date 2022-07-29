import { Cost } from "../../../common/Cost";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResourceProductionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class CatalyserTechnologyClass extends LifeformTechnology implements ResourceProductionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 10_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 6_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 1_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 0,
            },
        });
    }
    
    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.catalyserTechnology;
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

export const CatalyserTechnology = new CatalyserTechnologyClass();