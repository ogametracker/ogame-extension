import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class PsionicNetworkClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 15000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 10000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 5000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.psionicNetwork;
    }
}

export const PsionicNetwork = new PsionicNetworkClass();
