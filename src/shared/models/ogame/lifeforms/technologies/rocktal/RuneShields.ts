import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class RuneShieldsClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 500000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 300000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 200000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.runeShields;
    }
}

export const RuneShields = new RuneShieldsClass();
