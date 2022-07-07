import { Cost } from "../../../common/Cost";
import { LifeformProductionBonusBuilding } from "../LifeformProductionBonusBuilding";

class CrystalRefineryClass extends LifeformProductionBonusBuilding {
    public constructor() {
        super(
            85_000, 1.4,
            44_000, 1.4,
            25_000, 1.4,
            90, 1.1
        );
    }

    public getProductionBonus(level: number): Cost {
        const crystalBonus = 0.02; // 2%

        return {
            metal: 0,
            crystal: crystalBonus * level,
            deuterium: 0,
            energy: 0,
        };
    }
}

export const CrystalRefinery = new CrystalRefineryClass();