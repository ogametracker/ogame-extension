import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class NeuroInterfaceClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 70000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 40000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 20000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.neuroInterface;
    }
}

export const NeuroInterface = new NeuroInterfaceClass();
