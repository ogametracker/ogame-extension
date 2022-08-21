import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class AntimatterConvectorClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 8_500,
                increaseFactor: 1.25,
            },
            crystal: {
                baseCost: 5_000,
                increaseFactor: 1.25,
            },
            deuterium: {
                baseCost: 3_000,
                increaseFactor: 1.25,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.antimatterConvector;
    }
}

export const AntimatterConvector = new AntimatterConvectorClass();
