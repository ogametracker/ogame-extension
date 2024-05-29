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

    public appliesTo(resource: ResourceType | 'energy' | LifeformTechnologyType): boolean {
        if(LifeformTechnologyTypes.includes(resource as LifeformTechnologyType)) {
            return true;
        }
        
        return resource == 'energy';
    }
    
    public getLifeformTechnologyBonus(research: LifeformTechnologyType, level: number): number {
        if(!this.appliesTo(research)) {
            return 0;
        }

        const bonus = 0.00_3; // 0.3%
        return level * bonus;
    }

    public getProductionBonus(level: number): Cost {
        const energyBonus = 0.011; // 1%
        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: energyBonus * level,
        };
    }
}

export const HighPerformanceTransformer = new HighPerformanceTransformerClass();