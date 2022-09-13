import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class SupercomputerClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 500_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 300_000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 200_000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.supercomputer;
    }
}

export const Supercomputer = new SupercomputerClass();
