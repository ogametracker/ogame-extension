import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class ImprovedLabTechnologyClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 120_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 30_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 25_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.improvedLabTechnology;
    }
}

export const ImprovedLabTechnology = new ImprovedLabTechnologyClass();
