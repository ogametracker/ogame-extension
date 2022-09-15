import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class PlasmaTerraformerClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 100_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 40_000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 30_000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.plasmaTerraformer;
    }
}

export const PlasmaTerraformer = new PlasmaTerraformerClass();
