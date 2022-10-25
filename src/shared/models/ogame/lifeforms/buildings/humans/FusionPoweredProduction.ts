import { Cost } from "../../../common/Cost";
import { ResourceType } from "../../../resources/ResourceType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { ResourceProductionBonusLifeformBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class FusionPoweredProductionClass extends LifeformBuilding implements ResourceProductionBonusLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 50_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 25_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 15_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 80,
                increaseFactor: 1.1,
            },
        });
    }
    
    public get type(): LifeformBuildingType {
        return LifeformBuildingType.fusionPoweredProduction;
    }

    public appliesTo(resource: ResourceType): boolean {
        return [ResourceType.crystal, ResourceType.deuterium].includes(resource);
    }

    public getProductionBonus(level: number): Cost {
        const crystalBonus = 0.015; // 1.5%
        const deutBonusBonus = 0.01; // 1%

        return {
            metal: 0,
            crystal: crystalBonus * level,
            deuterium: deutBonusBonus * level,
            energy: 0,
        };
    }
}

export const FusionPoweredProduction = new FusionPoweredProductionClass();