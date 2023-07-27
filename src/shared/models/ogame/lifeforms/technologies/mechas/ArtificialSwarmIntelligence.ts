import { Cost } from "../../../common/Cost";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResourceProductionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class ArtificialSwarmIntelligenceClass extends LifeformTechnology implements ResourceProductionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 200_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 100_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 100_000,
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
        return LifeformTechnologyType.artificialSwarmIntelligence;
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

export const ArtificialSwarmIntelligence = new ArtificialSwarmIntelligenceClass();