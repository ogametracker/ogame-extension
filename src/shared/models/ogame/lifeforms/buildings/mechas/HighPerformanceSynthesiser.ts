import { Cost } from "../../../common/Cost";
import { LifeformProductionBonusBuilding } from "../LifeformProductionBonusBuilding";

class HighPerformanceSynthesiserClass extends LifeformProductionBonusBuilding {
    public constructor() {
        super(
            100_000, 1.5,
            40_000, 1.5,
            20_000, 1.5,
            60, 1.1
        );
    }

    public getProductionBonus(level: number): Cost {
        const deutBonus = 0.02; // 2%

        return {
            metal: 0,
            crystal: 0,
            deuterium: deutBonus * level,
            energy: 0,
        };
    }
}

export const HighPerformanceSynthesiser = new HighPerformanceSynthesiserClass();