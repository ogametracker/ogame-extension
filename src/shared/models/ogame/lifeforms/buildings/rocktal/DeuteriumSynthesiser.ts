import { Cost } from "../../../common/Cost";
import { ResourceType } from "../../../resources/ResourceType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { ResourceProductionBonusLifeformBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class DeuteriumSynthesiserClass extends LifeformBuilding implements ResourceProductionBonusLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 120_000,
                increaseFactor: 1.4,
            },
            crystal: {
                baseCost: 50_000,
                increaseFactor: 1.4,
            },
            deuterium: {
                baseCost: 20_000,
                increaseFactor: 1.4,
            },
            energy: {
                baseCost: 90,
                increaseFactor: 1.1,
            },
        });
    }
    
    public get type(): LifeformBuildingType {
        return LifeformBuildingType.deuteriumSynthesiser;
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

export const DeuteriumSynthesiser = new DeuteriumSynthesiserClass();