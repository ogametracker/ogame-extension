import { Cost } from "../../../common/Cost";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { ResourceProductionBonusLifeformBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class HighEnergySmeltingClass extends LifeformBuilding implements ResourceProductionBonusLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 6_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 3_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 3_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 40,
                increaseFactor: 1.1
            },
        });
    }
    
    public get type(): LifeformBuildingType {
        return LifeformBuildingType.highEnergySmelting;
    }

    public getProductionBonus(level: number): Cost {
        const metalBonus = 0.015; // 1.5%

        return {
            metal: metalBonus * level,
            crystal: 0,
            deuterium: 0,
            energy: 0,
        };
    }
}

export const HighEnergySmelting = new HighEnergySmeltingClass();