import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";
import { PhalanxRangeBonusLifeformTechnology } from "../interfaces";

class InterplanetaryAnalysisNetworkClass extends LifeformTechnology implements PhalanxRangeBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 80_000,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 50_000,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 20_000,
                increaseFactor: 1.2,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    getPhalanxRangeBonus(level: number): number {
        const bonusPerLevel = 0.00_6; //0.6%
        return bonusPerLevel * level;
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.interplanetaryAnalysisNetwork;
    }
}

export const InterplanetaryAnalysisNetwork = new InterplanetaryAnalysisNetworkClass();
