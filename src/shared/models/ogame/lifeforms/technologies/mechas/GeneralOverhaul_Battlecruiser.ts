import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class GeneralOverhaul_BattlecruiserClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 160000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 120000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 50000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.generalOverhaul_battlecruiser;
    }
}

export const GeneralOverhaul_Battlecruiser = new GeneralOverhaul_BattlecruiserClass();
