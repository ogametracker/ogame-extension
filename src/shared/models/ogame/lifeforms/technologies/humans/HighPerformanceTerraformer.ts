import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class HighPerformanceTerraformerClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 70_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 40_000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 20_000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.highPerformanceTerraformer;
    }
}

export const HighPerformanceTerraformer = new HighPerformanceTerraformerClass();
