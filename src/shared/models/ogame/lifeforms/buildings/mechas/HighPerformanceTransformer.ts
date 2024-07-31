import { Cost } from "../../../common/Cost";
import { ResourceType } from "../../../resources/ResourceType";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformTechnologyType, LifeformTechnologyTypes } from "../../LifeformTechnologyType";
import { LifeformTechnologyBonusLifeformBuilding, ResourceProductionBonusLifeformBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class HighPerformanceTransformerClass extends LifeformBuilding implements ResourceProductionBonusLifeformBuilding, LifeformTechnologyBonusLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 35_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 15_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 10_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 40,
                increaseFactor: 1.05,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [
            { type: LifeformBonusTypeId.ResourceProductionBonus },
            { type: LifeformBonusTypeId.LifeformResearchBonusBoost },
        ];
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.highPerformanceTransformer;
    }

    public get affectedTechnologies(): LifeformTechnologyType[] {
        return LifeformTechnologyTypes;
    }

    public getLifeformTechnologyBonus(technology: LifeformTechnologyType, level: number): number {
        if (!this.appliesTo(technology)) {
            return 0;
        }

        const techBonus = 0.00_3; // 0.3%
        return techBonus * level;
    }

    public appliesTo(resourceOrTechnology: ResourceType | 'energy' | LifeformTechnologyType): boolean {
        if (this.affectedTechnologies.includes(resourceOrTechnology as LifeformTechnologyType)) {
            return true;
        }

        return resourceOrTechnology == 'energy';
    }

    public getProductionBonus(level: number): Cost {
        const energyBonus = 0.01; // 1%
        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: energyBonus * level,
        };
    }
}

export const HighPerformanceTransformer = new HighPerformanceTransformerClass();