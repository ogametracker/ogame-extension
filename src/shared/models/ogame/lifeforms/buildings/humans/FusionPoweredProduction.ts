import { Cost } from "../../../common/Cost";
import { LifeformProductionBonusBuilding } from "../LifeformProductionBonusBuilding";

class FusionPoweredProductionClass extends LifeformProductionBonusBuilding {
    public constructor() {
        super(
            50_000, 1.5,
            25_000, 1.5,
            15_000, 1.5,
            80, 1.1
        );
    }

    public getProductionBonus(level: number): Cost {
        const crystalBonus = 0.015; // 1.5%
        const deutBonusBonus = 0.01; // 1%

        return {
            metal: 0,
            crystal: crystalBonus * level,
            deuterium: deutBonusBonus * level,
            energy: 0,
        };
    }
}

export const FusionPoweredProduction = new FusionPoweredProductionClass();