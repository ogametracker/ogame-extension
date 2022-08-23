import { Cost } from "../../../common/Cost";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResourceProductionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class SeismicMiningTechnologyClass extends LifeformTechnology implements ResourceProductionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 120_00,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 30_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 25_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 0,
            },
        });
    }
    
    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.seismicMiningTechnology;
    }

    public getProductionBonus(level: number): Cost {
        const crystalBonus = 0.00_08; // 0.08%

        return {
            metal: 0,
            crystal: crystalBonus * level,
            deuterium: 0,
            energy: 0,
        };
    }
}

export const SeismicMiningTechnology = new SeismicMiningTechnologyClass();