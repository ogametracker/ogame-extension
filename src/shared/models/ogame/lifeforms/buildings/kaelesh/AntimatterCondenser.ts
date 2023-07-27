import { LifeformBonusType } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class AntimatterCondenserClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 6,
                increaseFactor: 1.21,
            },
            crystal: {
                baseCost: 3,
                increaseFactor: 1.21,
            },
            deuterium: {
                baseCost: 0,
                increaseFactor: 1,
            },
            energy: {
                baseCost: 9,
                increaseFactor: 1.02,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [];
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.antimatterCondenser;
    }
}

export const AntimatterCondenser = new AntimatterCondenserClass();
