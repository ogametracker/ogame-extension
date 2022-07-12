import { Cost } from "../../../common/Cost";
import { ResearchType } from "../../../research/ResearchType";
import { CostAndTimeReduction } from "../../common-interfaces";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ResearchCostAndTimeReductionLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class ImprovedStellaratorClass extends LifeformTechnology implements ResearchCostAndTimeReductionLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 70_000,
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
                baseCost: 0,
                increaseFactor: 0,
            },
        });
    }
    
    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.improvedStellarator;
    }
    
    public getResearchCostAndTimeReduction(research: ResearchType, level: number): CostAndTimeReduction {
        if(research != ResearchType.plasmaTechnology) {
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