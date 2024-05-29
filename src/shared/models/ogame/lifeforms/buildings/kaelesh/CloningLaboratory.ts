import { LifeformBonusType } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformTechnologyType, LifeformTechnologyTypesByLifeform } from "../../LifeformTechnologyType";
import { LifeformType } from "../../LifeformType";
import { LifeformBuilding } from "../LifeformBuilding";
import { LifeformTechnologyBonusLifeformBuilding } from "../interfaces";

class CloningLaboratoryClass extends LifeformBuilding implements LifeformTechnologyBonusLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 15_000,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 15_000,
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


    appliesTo(research: LifeformTechnologyType): boolean {
        return LifeformTechnologyTypesByLifeform[LifeformType.kaelesh].includes(research);
    }
    
    public getLifeformTechnologyBonus(research: LifeformTechnologyType, level: number): number {
        if(!this.appliesTo(research)) {
            return 0;
        }
        
        const bonus = 0.00_25; // 0.25%
        return level * bonus;
    }

    public get bonuses(): LifeformBonusType[] {
        return [];
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.cloningLaboratory;
    }
}

export const CloningLaboratory = new CloningLaboratoryClass();
