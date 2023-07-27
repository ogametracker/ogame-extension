import { ResearchType } from "../../../research/ResearchType";
import { ResearchTypes } from "../../../research/ResearchTypes";
import { CostAndTimeReduction } from "../../common-interfaces";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformTechnologyType, LifeformTechnologyTypes } from "../../LifeformTechnologyType";
import { ResearchCostAndTimeReductionLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class RobotAssistantsClass extends LifeformTechnology implements ResearchCostAndTimeReductionLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 300_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 180_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 120_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [...ResearchTypes, ...LifeformTechnologyTypes].filter(t => this.appliesTo(t))
            .map<LifeformBonusType>(tech => ({
                type: LifeformBonusTypeId.TechTimeReduction,
                tech,
            }));
    }

    public appliesTo(research: LifeformTechnologyType | ResearchType): boolean {
        return [
            ...ResearchTypes,
            ...LifeformTechnologyTypes,
        ].includes(research);
    }

    public getResearchCostAndTimeReduction(research: LifeformTechnologyType | ResearchType, level: number): CostAndTimeReduction {
        if (!this.appliesTo(research)) {
            return { cost: 0, time: 0 };
        }

        const timeReductionPerLevel = 0.00_2; //0.2%
        const maxTimeReduction = 0.99; //99%

        return {
            time: Math.min(maxTimeReduction, timeReductionPerLevel * level),
            cost: 0,
        };
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.robotAssistants;
    }
}

export const RobotAssistants = new RobotAssistantsClass();
