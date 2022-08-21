import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class FusionDrivesClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 15_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 10_000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 5_000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.fusionDrives;
    }
}

export const FusionDrives = new FusionDrivesClass();
