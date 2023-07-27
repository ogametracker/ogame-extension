import { Cost } from "../../../common/Cost";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResourceProductionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class AcousticScanningClass extends LifeformTechnology implements ResourceProductionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 7_500,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 12_500,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 5_000,
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
        return LifeformTechnologyType.acousticScanning;
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

export const AcousticScanning = new AcousticScanningClass();