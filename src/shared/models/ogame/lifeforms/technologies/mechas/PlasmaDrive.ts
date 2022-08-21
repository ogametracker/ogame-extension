import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class PlasmaDriveClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 7500,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 12500,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 5000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.plasmaDrive;
    }
}

export const PlasmaDrive = new PlasmaDriveClass();
