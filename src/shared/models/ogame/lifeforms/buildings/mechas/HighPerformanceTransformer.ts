import { Cost } from "../../../common/Cost";
import { LifeformTechnologyBonusLifeformBuilding, ResourceProductionBonusLifeformBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class HighPerformanceTransformerClass extends LifeformBuilding implements ResourceProductionBonusLifeformBuilding, LifeformTechnologyBonusLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 35_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 15_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 10_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 40,
                increaseFactor: 1.05,
            },
        });
    }

    public getLifeformTechnologyBonus(level: number): number {
        const techBonus = 0.003; // 0.3%
        return techBonus * level;
    }

    public getProductionBonus(level: number): Cost {
        const energyBonus = 0.011; // 1%
        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: energyBonus * level,
        };
    }
}

export const HighPerformanceTransformer = new HighPerformanceTransformerClass();