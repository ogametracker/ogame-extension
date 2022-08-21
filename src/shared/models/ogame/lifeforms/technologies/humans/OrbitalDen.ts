import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class OrbitalDenClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 25_000,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 20_000,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 10_000,
                increaseFactor: 1.2,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.orbitalDen;
    }
}

export const OrbitalDen = new OrbitalDenClass();
