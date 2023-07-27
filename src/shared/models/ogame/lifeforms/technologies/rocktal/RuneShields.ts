import { ResearchType } from "../../../research/ResearchType";
import { ResearchTypes } from "../../../research/ResearchTypes";
import { CostAndTimeReduction } from "../../common-interfaces";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformTechnologyType, LifeformTechnologyTypes } from "../../LifeformTechnologyType";
import { ResearchCostAndTimeReductionLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class RuneShieldsClass extends LifeformTechnology implements ResearchCostAndTimeReductionLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 500_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 300_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 200_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return ResearchTypes.filter(t => this.appliesTo(t))
            .flatMap<LifeformBonusType>(tech => [
                {
                    type: LifeformBonusTypeId.TechCostReduction,
                    tech,
                },
                {
                    type: LifeformBonusTypeId.TechTimeReduction,
                    tech,
                }
            ]);
    }

    public appliesTo(research: ResearchType): boolean {
        return research == ResearchType.armorTechnology;
    }

    public getResearchCostAndTimeReduction(research: ResearchType, level: number): CostAndTimeReduction {
        if (!this.appliesTo(research)) {
            return { cost: 0, time: 0 };
        }

        const timeReductionPerLevel = 0.00_2; //0.2%
        const maxTimeReduction = 0.99; //99%

        const costReductionPerLevel = 0.00_2; //0.2%
        const maxCostReduction = 0.5; //50%

        return {
            cost: Math.min(maxCostReduction, costReductionPerLevel * level),
            time: Math.min(maxTimeReduction, timeReductionPerLevel * level),
        };
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.runeShields;
    }
}

export const RuneShields = new RuneShieldsClass();
