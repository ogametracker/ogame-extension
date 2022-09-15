import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class LowTemperatureDrivesClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 200_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 100_000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 100_000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.lowTemperatureDrives;
    }
}

export const LowTemperatureDrives = new LowTemperatureDrivesClass();
