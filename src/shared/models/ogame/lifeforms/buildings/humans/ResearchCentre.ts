import { CostAndTimeReduction } from "../../common-interfaces";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformTechnologyTypes } from "../../LifeformTechnologyType";
import { LifeformTechnologyResearchBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class ResearchCentreClass extends LifeformBuilding implements LifeformTechnologyResearchBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 20_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 25_000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 10_000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 10,
                increaseFactor: 1.08,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return LifeformTechnologyTypes.flatMap<LifeformBonusType>(tech => [
            {
                type: LifeformBonusTypeId.TechCostReduction,
                tech,
            },
            {
                type: LifeformBonusTypeId.TechTimeReduction,
                tech,
            },
        ]);
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.researchCentre;
    }

    public getLifeformTechnologyResearchCostAndTimeReduction(level: number): CostAndTimeReduction {
        // yep
        if (level == 1) {
            return { cost: 0, time: 0 };
        }

        const costReduction = 0.0025; // 0.25%
        const timeReduction = 0.02; // 2%
        return {
            cost: costReduction * level,
            time: timeReduction * level,
        };
    }
}

export const ResearchCentre = new ResearchCentreClass();