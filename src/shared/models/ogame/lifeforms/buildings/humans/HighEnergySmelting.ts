import { Cost } from "../../../common/Cost";
import { LifeformProductionBonusBuilding } from "../LifeformProductionBonusBuilding";

class HighEnergySmeltingClass extends LifeformProductionBonusBuilding {
    public constructor() {
        super(
            9_000, 1.5,
            6_000, 1.5,
            3_000, 1.5,
            40, 1.1
        );
    }

    public getProductionBonus(level: number): Cost {
        const metalBonus = 0.015; // 1.5%

        return {
            metal: metalBonus * level,
            crystal: 0,
            deuterium: 0,
            energy: 0,
        };
    }
}

export const HighEnergySmelting = new HighEnergySmeltingClass();