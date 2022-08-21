import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class ShipManufacturingHallClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 75_000,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 50_000,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 55_000,
                increaseFactor: 1.2,
            },
            energy: {
                baseCost: 90,
                increaseFactor: 1.04,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.shipManufacturingHall;
    }
}

export const ShipManufacturingHall = new ShipManufacturingHallClass();
