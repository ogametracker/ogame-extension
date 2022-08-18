import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class BiosphereFarmClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 5,
                increaseFactor: 1.23,
            },
            crystal: {
                baseCost: 2,
                increaseFactor: 1.23,
            },
            deuterium: {
                baseCost: 0,
                increaseFactor: 1,
            },
            energy: {
                baseCost: 8,
                increaseFactor: 1.02,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.biosphereFarm;
    }
}

export const BiosphereFarm = new BiosphereFarmClass();
