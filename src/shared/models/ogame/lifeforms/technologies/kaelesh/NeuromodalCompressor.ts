import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class NeuromodalCompressorClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 50000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 50000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 20000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.neuromodalCompressor;
    }
}

export const NeuromodalCompressor = new NeuromodalCompressorClass();
