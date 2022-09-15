import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class TelekineticTractorBeamClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 20000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 15000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 7500,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.telekineticTractorBeam;
    }
}

export const TelekineticTractorBeam = new TelekineticTractorBeamClass();
