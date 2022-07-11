import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformTechnologyBonusLifeformBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class MetropolisClass extends LifeformBuilding implements LifeformTechnologyBonusLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 80_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 35_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 60_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 90,
                increaseFactor: 1.1
            },
        });
    }
    
    public get type(): LifeformBuildingType {
        return LifeformBuildingType.metropolis;
    }
    
    public getLifeformTechnologyBonus(level: number): number {
        const bonus = 0.005; // 0.5%
        return level * bonus;
    }
}

export const Metropolis = new MetropolisClass();