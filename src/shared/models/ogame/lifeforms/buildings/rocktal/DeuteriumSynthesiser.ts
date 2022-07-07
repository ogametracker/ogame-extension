import { Cost } from "../../../common/Cost";
import { LifeformProductionBonusBuilding } from "../LifeformProductionBonusBuilding";

class DeuteriumSynthesiserClass extends LifeformProductionBonusBuilding {
    public constructor() {
        super(
            120_000, 1.4,
            50_000, 1.4,
            20_000, 1.4,
            90, 1.1
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

export const DeuteriumSynthesiser = new DeuteriumSynthesiserClass();