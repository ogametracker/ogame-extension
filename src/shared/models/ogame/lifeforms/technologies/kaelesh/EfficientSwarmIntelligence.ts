import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class EfficientSwarmIntelligenceClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 200000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 100000,
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
        return LifeformTechnologyType.efficientSwarmIntelligence;
    }
}

export const EfficientSwarmIntelligence = new EfficientSwarmIntelligenceClass();
