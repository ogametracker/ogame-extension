import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class SupraRefractorClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 500000,
                increaseFactor: 1.4,
            },
            crystal: {
                baseCost: 250000,
                increaseFactor: 1.4,
            },
            deuterium: {
                baseCost: 250000,
                increaseFactor: 1.4,
            },
            energy: {
                baseCost: 100,
                increaseFactor: 1.05,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.supraRefractor;
    }
}

export const SupraRefractor = new SupraRefractorClass();
