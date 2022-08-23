import { Cost } from "../../../common/Cost";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResourceProductionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class AutomatedTransportLinesClass extends LifeformTechnology implements ResourceProductionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 50_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 50_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 20_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 0,
            },
        });
    }
    
    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.automatedTransportLines;
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

export const AutomatedTransportLines = new AutomatedTransportLinesClass();