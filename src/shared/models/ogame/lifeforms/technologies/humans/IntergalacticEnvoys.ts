import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class IntergalacticEnvoysClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 5_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 2_500,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 500,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.intergalacticEnvoys;
    }
}

export const IntergalacticEnvoys = new IntergalacticEnvoysClass();
