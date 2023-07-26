import { Cost } from "../../../common/Cost";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResourceProductionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class VolcanicBatteriesClass extends LifeformTechnology implements ResourceProductionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 10_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 6_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 1_000,
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
        return LifeformTechnologyType.volcanicBatteries;
    }

    public getProductionBonus(level: number): Cost {
        const energyBonus = 0.00_25; // 0.25%

        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: energyBonus * level,
        };
    }
}

export const VolcanicBatteries = new VolcanicBatteriesClass();