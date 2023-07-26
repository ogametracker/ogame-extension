import { Cost } from "../../../common/Cost";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResourceProductionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class DepthSoundingClass extends LifeformTechnology implements ResourceProductionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 70_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 40_000,
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

    public get bonuses(): LifeformBonusType[] {
        return [{ type: LifeformBonusTypeId.ResourceProductionBonus }];
    }
    
    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.depthSounding;
    }

    public getProductionBonus(level: number): Cost {
        const metalBonus = 0.00_08; // 0.08%

        return {
            metal: metalBonus * level,
            crystal: 0,
            deuterium: 0,
            energy: 0,
        };
    }
}

export const DepthSounding = new DepthSoundingClass();