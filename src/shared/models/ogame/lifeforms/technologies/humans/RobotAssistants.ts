import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class RobotAssistantsClass extends LifeformTechnology {
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

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.robotAssistants;
    }
}

export const RobotAssistants = new RobotAssistantsClass();
