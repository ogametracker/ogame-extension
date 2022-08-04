import { Cost } from "../../../common/Cost";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { CrawlerProductionBonusAndConsumptionReductionLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class IonCrystalModulesClass extends LifeformTechnology implements CrawlerProductionBonusAndConsumptionReductionLifeformTechnology {
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
    
    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.ionCrystalModules;
    }
    
    public getCrawlerProductionBonus(level: number): number {
        const bonus = 0.00_1; //0.1%
        return level * bonus;
    }
    
    public getCrawlerConsumptionReduction(level: number): Cost {
        const energyReduction = 0.00_1; //0.1%
        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: energyReduction * level,
        };
    }
}

export const IonCrystalModules = new IonCrystalModulesClass();