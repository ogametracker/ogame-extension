import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class ChrysalisAcceleratorClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 75_000,
                increaseFactor: 1.05,
            },
            crystal: {
                baseCost: 25_000,
                increaseFactor: 1.05,
            },
            deuterium: {
                baseCost: 30_000,
                increaseFactor: 1.05,
            },
            energy: {
                baseCost: 30,
                increaseFactor: 1.03,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.chrysalisAccelerator;
    }
}

export const ChrysalisAccelerator = new ChrysalisAcceleratorClass();
