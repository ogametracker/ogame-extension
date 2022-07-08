import { LifeformTechnologyBonusLifeformBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class ChipMassProductionClass extends LifeformBuilding implements LifeformTechnologyBonusLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 55_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 50_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 30_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 70,
                increaseFactor: 1.05,
            },
        });
    }

    public getLifeformTechnologyBonus(level: number): number {
        const techBonus = 0.003; // 0.3%
        return techBonus * level;
    }
}

export const ChipMassProduction = new ChipMassProductionClass();