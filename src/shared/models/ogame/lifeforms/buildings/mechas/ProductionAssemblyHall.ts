import { LifeformBonusType } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class ProductionAssemblyHallClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 100_000,
                increaseFactor: 1.14,
            },
            crystal: {
                baseCost: 10_000,
                increaseFactor: 1.14,
            },
            deuterium: {
                baseCost: 3_000,
                increaseFactor: 1.14,
            },
            energy: {
                baseCost: 80,
                increaseFactor: 1.04,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [];
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.productionAssemblyHall;
    }
}

export const ProductionAssemblyHall = new ProductionAssemblyHallClass();
