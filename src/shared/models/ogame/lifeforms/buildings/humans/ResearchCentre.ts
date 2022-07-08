import { AnyBuildingType, CostAndTimeReduction, LifeformTechnologyResearchBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class ResearchCentreClass extends LifeformBuilding implements LifeformTechnologyResearchBuilding {
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
                increaseFactor: 1.1
            },
        });
    }
    
    public getLifeformTechnologyResearchCostAndTimeReduction(level: number): CostAndTimeReduction {
        // yep
        if(level == 1) {
            return { cost: 0, time: 0};
        }

        const costReduction = 0.005; // 0.5%
        const timeReduction = 0.02; // 2%
        return {
            cost: costReduction * level,
            time: timeReduction * level,
        };
    }
}

export const ResearchCentre = new ResearchCentreClass();