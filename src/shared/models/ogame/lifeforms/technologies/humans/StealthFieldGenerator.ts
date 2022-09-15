import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class StealthFieldGeneratorClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 20_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 15_000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 7_500,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.stealthFieldGenerator;
    }
}

export const StealthFieldGenerator = new StealthFieldGeneratorClass();
