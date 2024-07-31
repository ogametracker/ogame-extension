import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformTechnologyType, LifeformTechnologyTypes } from "../../LifeformTechnologyType";
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
                increaseFactor: 1.05,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [{ type: LifeformBonusTypeId.LifeformResearchBonusBoost }];
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.metropolis;
    }

    public get affectedTechnologies(): LifeformTechnologyType[] {
        return LifeformTechnologyTypes;
    }

    public appliesTo(technology: LifeformTechnologyType): boolean {
        return this.affectedTechnologies.includes(technology);
    }

    public getLifeformTechnologyBonus(technology: LifeformTechnologyType, level: number): number {
        if (!this.appliesTo(technology)) {
            return 0;
        }

        const bonus = 0.00_5; // 0.5%
        return level * bonus;
    }
}

export const Metropolis = new MetropolisClass();