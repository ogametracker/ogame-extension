import { ResearchType } from "../../../research/ResearchType";
import { CostAndTimeReduction } from "../../common-interfaces";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResearchCostAndTimeReductionLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class ImprovedStellaratorClass extends LifeformTechnology implements ResearchCostAndTimeReductionLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 75_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 55_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 25_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }
    
    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.improvedStellarator;
    }
    
    public appliesTo(research: ResearchType): boolean {
        return research == ResearchType.plasmaTechnology;
    }
    
    public getResearchCostAndTimeReduction(research: ResearchType, level: number): CostAndTimeReduction {
        if(!this.appliesTo(research)) {
            return { cost: 0, time: 0};
        }

        const costReduction = 0.00_15; // 0.15%
        const timeReduction = 0.00_3; // 0.3%
        return {
            cost: costReduction * level,
            time: timeReduction * level,
        };
    }
}

export const ImprovedStellarator = new ImprovedStellaratorClass();