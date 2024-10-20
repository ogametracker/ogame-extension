import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { FleetFuelReturnLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class SlingshotAutopilotClass extends LifeformTechnology implements FleetFuelReturnLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 85_000,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 40_000,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 35_000,
                increaseFactor: 1.2,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [{ type: LifeformBonusTypeId.FuelReturn }];
    }

    public getFuelReturn(level: number): number {
        const returnPerLevel = 0.00_15; //0.15%
        const maxReturn = 0.9; //90%

        return Math.min(maxReturn, returnPerLevel * level);
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.slingshotAutopilot;
    }
}

export const SlingshotAutopilot = new SlingshotAutopilotClass();
