import { Cost } from "../../../common/Cost";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResourceProductionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class HardenedDiamondDrillHeadsClass extends LifeformTechnology implements ResourceProductionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 85_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 40_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 35_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 0,
            },
        });
    }
    
    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.hardenedDiamondDrillHeads;
    }

    public getProductionBonus(level: number): Cost {
        const metalBonus = 0.00_08; // 0.08%

        return {
            metal: metalBonus * level,
            crystal: 0,
            deuterium: 0,
            energy: 0,
        };
    }
}

export const HardenedDiamondDrillHeads = new HardenedDiamondDrillHeadsClass();