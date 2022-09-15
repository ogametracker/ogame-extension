import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class Overclocking_HeavyFighterClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 320000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 240000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 100000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.overclocking_heavyFighter;
    }
}

export const Overclocking_HeavyFighter = new Overclocking_HeavyFighterClass();
