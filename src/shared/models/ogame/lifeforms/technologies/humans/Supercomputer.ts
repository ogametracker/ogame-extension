import { ResearchType } from "../../../research/ResearchType";
import { CostAndTimeReduction } from "../../common-interfaces";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResearchCostAndTimeReductionLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class SupercomputerClass extends LifeformTechnology implements ResearchCostAndTimeReductionLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 500_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 300_000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 200_000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }
    
    public appliesTo(research: LifeformTechnologyType | ResearchType): boolean {
        return research == ResearchType.astrophysics;
    }
    
    public getResearchCostAndTimeReduction(research: LifeformTechnologyType | ResearchType, level: number): CostAndTimeReduction {
        if(!this.appliesTo(research)) {
            return { cost: 0, time: 0 };
        }
        
        const timeReductionPerLevel = 0.00_1; //0.1%
        const maxTimeReduction = 0.99; //99%

        return {
            cost: 0,
            time: Math.min(maxTimeReduction, timeReductionPerLevel * level),
        };
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.supercomputer;
    }
}

export const Supercomputer = new SupercomputerClass();
