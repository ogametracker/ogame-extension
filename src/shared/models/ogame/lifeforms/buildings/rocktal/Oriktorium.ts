import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class OriktoriumClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 50000,
                increaseFactor: 1.65,
            },
            crystal: {
                baseCost: 40000,
                increaseFactor: 1.65,
            },
            deuterium: {
                baseCost: 50000,
                increaseFactor: 1.65,
            },
            energy: {
                baseCost: 60,
                increaseFactor: 1.3,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.oriktorium;
    }
}

export const Oriktorium = new OriktoriumClass();
