import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class OptimisedSiloConstructionMethodClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 220000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 110000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 110000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.optimisedSiloConstructionMethod;
    }
}

export const OptimisedSiloConstructionMethod = new OptimisedSiloConstructionMethodClass();
