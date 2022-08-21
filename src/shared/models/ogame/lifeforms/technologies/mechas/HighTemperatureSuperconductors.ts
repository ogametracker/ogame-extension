import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class HighTemperatureSuperconductorsClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 120000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 30000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 25000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.highTemperatureSuperconductors;
    }
}

export const HighTemperatureSuperconductors = new HighTemperatureSuperconductorsClass();
