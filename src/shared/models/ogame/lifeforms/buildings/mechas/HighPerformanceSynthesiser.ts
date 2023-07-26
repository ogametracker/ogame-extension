import { Cost } from "../../../common/Cost";
import { ResourceType } from "../../../resources/ResourceType";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { ResourceProductionBonusLifeformBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class HighPerformanceSynthesiserClass extends LifeformBuilding implements ResourceProductionBonusLifeformBuilding  {
    public constructor() {
        super({
            metal: {
                baseCost: 100_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 40_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 20_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 60,
                increaseFactor: 1.1,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [{ type: LifeformBonusTypeId.ResourceProductionBonus }];
    }
    
    public get type(): LifeformBuildingType {
        return LifeformBuildingType.highPerformanceSynthesiser;
    }

    public appliesTo(resource: ResourceType): boolean {
        return [ResourceType.deuterium].includes(resource);
    }

    public getProductionBonus(level: number): Cost {
        const deutBonus = 0.02; // 2%

        return {
            metal: 0,
            crystal: 0,
            deuterium: deutBonus * level,
            energy: 0,
        };
    }
}

export const HighPerformanceSynthesiser = new HighPerformanceSynthesiserClass();