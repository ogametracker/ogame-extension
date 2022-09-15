import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class SlingshotAutopilotClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 85000,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 40000,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 35000,
                increaseFactor: 1.2,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.slingshotAutopilot;
    }
}

export const SlingshotAutopilot = new SlingshotAutopilotClass();
