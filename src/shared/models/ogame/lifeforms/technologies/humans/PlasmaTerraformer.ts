import { BuildingType } from "../../../buildings/BuildingType";
import { CostAndTimeReduction } from "../../common-interfaces";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { BuildingCostAndTimeReductionLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class PlasmaTerraformerClass extends LifeformTechnology implements BuildingCostAndTimeReductionLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 100_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 40_000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 30_000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public appliesTo(building: BuildingType): boolean {
        return building == BuildingType.terraformer;
    }

    public getBuildingCostAndTimeReduction(building: BuildingType, level: number): CostAndTimeReduction {
        if (!this.appliesTo(building)) {
            return { cost: 0, time: 0 };
        }

        const costReductionPerLevel = 0.00_1; //0.1%
        const maxCostReduction = 0.5; //50%;

        const timeReductionPerLevel = 0.00_2; //0.2%
        const maxTimeReduction = 0.99; //99%

        return {
            cost: Math.min(maxCostReduction, costReductionPerLevel * level),
            time: Math.min(maxTimeReduction, timeReductionPerLevel * level),
        };
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.plasmaTerraformer;
    }
}

export const PlasmaTerraformer = new PlasmaTerraformerClass();
