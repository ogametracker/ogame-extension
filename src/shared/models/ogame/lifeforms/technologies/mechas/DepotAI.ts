import { BuildingType } from "../../../buildings/BuildingType";
import { CostAndTimeReduction } from "../../common-interfaces";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { BuildingCostAndTimeReductionLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class DepotAIClass extends LifeformTechnology implements BuildingCostAndTimeReductionLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 20000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 15000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 7500,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public appliesTo(building: BuildingType): boolean {
        return building == BuildingType.allianceDepot;
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
        return LifeformTechnologyType.depotAI;
    }
}

export const DepotAI = new DepotAIClass();
