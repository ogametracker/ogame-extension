import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class InterplanetaryAnalysisNetworkClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 80000,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 50000,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 20000,
                increaseFactor: 1.2,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.interplanetaryAnalysisNetwork;
    }
}

export const InterplanetaryAnalysisNetwork = new InterplanetaryAnalysisNetworkClass();
