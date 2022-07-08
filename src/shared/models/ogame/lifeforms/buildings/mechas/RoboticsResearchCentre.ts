import { AnyBuildingCostAndTimeReductionLifeformBuilding, AnyBuildingType, CostAndTimeReduction } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class RoboticsResearchCentreClass extends LifeformBuilding implements AnyBuildingCostAndTimeReductionLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 20_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 20_000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 30_000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 10,
                increaseFactor: 1.08,
            },
        });
    }
    
    public getCostAndTimeReduction(building: AnyBuildingType, level: number): CostAndTimeReduction {
        // yep
        if(level == 1) {
            return { cost: 0, time: 0};
        }

        const costReduction = 0.0025; // 0.25%
        const timeReduction = 0.02; // 2%
        return {
            cost: costReduction * level,
            time: timeReduction * level,
        };
    }
}

export const RoboticsResearchCentre = new RoboticsResearchCentreClass();