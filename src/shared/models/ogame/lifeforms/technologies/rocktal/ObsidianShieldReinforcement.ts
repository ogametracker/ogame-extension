import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class ObsidianShieldReinforcementClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 250000,
                increaseFactor: 1.4,
            },
            crystal: {
                baseCost: 250000,
                increaseFactor: 1.4,
            },
            deuterium: {
                baseCost: 250000,
                increaseFactor: 1.4,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.obsidianShieldReinforcement;
    }
}

export const ObsidianShieldReinforcement = new ObsidianShieldReinforcementClass();
