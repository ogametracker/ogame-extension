import { Cost } from "../../../common/Cost";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResourceProductionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class HighPerformanceExtractorsClass extends LifeformTechnology implements ResourceProductionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 7_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 10_000,
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

    public get bonuses(): LifeformBonusType[] {
        return [{ type: LifeformBonusTypeId.ResourceProductionBonus }];
    }
    
    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.highPerformanceExtractors;
    }

    public getProductionBonus(level: number): Cost {
        const bonus = 0.00_06; // 0.06%

        return {
            metal: bonus * level,
            crystal: bonus * level,
            deuterium: bonus * level,
            energy: 0,
        };
    }
}

export const HighPerformanceExtractors = new HighPerformanceExtractorsClass();