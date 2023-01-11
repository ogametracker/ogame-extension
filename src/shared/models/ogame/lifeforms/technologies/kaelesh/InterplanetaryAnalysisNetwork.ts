import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class InterplanetaryAnalysisNetworkClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 80_000,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 50_000,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 20_000,
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
