import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class SanctuaryClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 4,
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
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.sanctuary;
    }
}

export const Sanctuary = new SanctuaryClass();
