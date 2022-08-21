import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class HeatRecoveryClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 10000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 6000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 1000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.heatRecovery;
    }
}

export const HeatRecovery = new HeatRecoveryClass();
