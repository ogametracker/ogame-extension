import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class DiamondEnergyTransmitterClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 240000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 120000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 120000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.diamondEnergyTransmitter;
    }
}

export const DiamondEnergyTransmitter = new DiamondEnergyTransmitterClass();
