import { CostAndTimeReduction } from "../../common-interfaces";
import { LifeformBuildingType, LifeformBuildingTypesByLifeform } from "../../LifeformBuildingType";
import { LifeformType } from "../../LifeformType";
import { AnyBuildingCostAndTimeReductionLifeformBuilding, AnyBuildingType } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class MegalithClass extends LifeformBuilding implements AnyBuildingCostAndTimeReductionLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 50_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 35_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 15_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 80,
                increaseFactor: 1.3,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.megalith;
    }

    public getCostAndTimeReduction(building: AnyBuildingType, level: number): CostAndTimeReduction {
        if (!this.appliesTo(building)) {
            return { cost: 0, time: 0 };
        }

        const costReduction = 0.01; //1%
        const timeReduction = 0.01; //1%
        return {
            cost: costReduction * level,
            time: timeReduction * level,
        };
    }

    public appliesTo(building: AnyBuildingType): boolean {
        const buildings: AnyBuildingType[] = LifeformBuildingTypesByLifeform[LifeformType.rocktal];
        return buildings.includes(building);
    }
}

export const Megalith = new MegalithClass();