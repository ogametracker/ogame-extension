import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class EnhancedSensorTechnologyClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 25000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 20000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 10000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.enhancedSensorTechnology;
    }
}

export const EnhancedSensorTechnology = new EnhancedSensorTechnologyClass();
