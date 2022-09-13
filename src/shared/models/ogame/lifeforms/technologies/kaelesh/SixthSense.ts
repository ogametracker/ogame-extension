import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class SixthSenseClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 120000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 30000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 25000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.sixthSense;
    }
}

export const SixthSense = new SixthSenseClass();
