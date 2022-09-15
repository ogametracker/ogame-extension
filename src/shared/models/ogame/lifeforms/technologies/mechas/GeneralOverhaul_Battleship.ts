import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class GeneralOverhaul_BattleshipClass extends LifeformTechnology {
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
        return LifeformTechnologyType.generalOverhaul_battleship;
    }
}

export const GeneralOverhaul_Battleship = new GeneralOverhaul_BattleshipClass();
