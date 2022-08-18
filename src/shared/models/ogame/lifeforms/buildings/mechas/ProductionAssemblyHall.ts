import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class ProductionAssemblyHallClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 100000,
                increaseFactor: 1.14,
            },
            crystal: {
                baseCost: 10000,
                increaseFactor: 1.14,
            },
            deuterium: {
                baseCost: 3000,
                increaseFactor: 1.14,
            },
            energy: {
                baseCost: 80,
                increaseFactor: 1.04,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.productionAssemblyHall;
    }
}

export const ProductionAssemblyHall = new ProductionAssemblyHallClass();
