import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class LightFighterMkIIClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 320_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 240_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 100_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.lightFighterMkII;
    }
}

export const LightFighterMkII = new LightFighterMkIIClass();
