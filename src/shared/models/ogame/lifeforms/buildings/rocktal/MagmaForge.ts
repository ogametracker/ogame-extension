import { Cost } from "../../../common/Cost";
import { LifeformProductionBonusBuilding } from "../LifeformProductionBonusBuilding";

class MagmaForgeClass extends LifeformProductionBonusBuilding {
    public constructor() {
        super(
            10_000, 1.4,
            8_000, 1.4,
            1_000, 1.4,
            40, 1.1
        );
    }

    public getProductionBonus(level: number): Cost {
        const metalBonus = 0.02; // 2%

        return {
            metal: metalBonus * level,
            crystal: 0,
            deuterium: 0,
            energy: 0,
        };
    }
}

export const MagmaForge = new MagmaForgeClass();