import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class SkyscraperClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 75000,
                increaseFactor: 1.09,
            },
            crystal: {
                baseCost: 20000,
                increaseFactor: 1.09,
            },
            deuterium: {
                baseCost: 25000,
                increaseFactor: 1.09,
            },
            energy: {
                baseCost: 50,
                increaseFactor: 1.02,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.skyscraper;
    }
}

export const Skyscraper = new SkyscraperClass();
