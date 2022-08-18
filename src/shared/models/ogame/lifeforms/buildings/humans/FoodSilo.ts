import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class FoodSiloClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 25000,
                increaseFactor: 1.09,
            },
            crystal: {
                baseCost: 13000,
                increaseFactor: 1.09,
            },
            deuterium: {
                baseCost: 7000,
                increaseFactor: 1.09,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.foodSilo;
    }
}

export const FoodSilo = new FoodSiloClass();
