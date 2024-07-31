import { LifeformBonusType } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformTechnologyType, LifeformTechnologyTypesByLifeform } from "../../LifeformTechnologyType";
import { LifeformType } from "../../LifeformType";
import { LifeformTechnologyBonusLifeformBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

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

    public get bonuses(): LifeformBonusType[] {
        return [];
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.cloningLaboratory;
    }

    public get affectedTechnologies(): LifeformTechnologyType[] {
        return LifeformTechnologyTypesByLifeform[LifeformType.kaelesh];
    }

    public appliesTo(technology: LifeformTechnologyType): boolean {
        return this.affectedTechnologies.includes(technology);
    }

    public getLifeformTechnologyBonus(technology: LifeformTechnologyType, level: number): number {
        if (!this.appliesTo(technology)) {
            return 0;
        }

        const bonus = 0.00_25; // 0.25%
        return level * bonus;
    }
}

export const CloningLaboratory = new CloningLaboratoryClass();
