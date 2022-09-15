import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class HallsOfRealisationClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 7_500,
                increaseFactor: 1.8,
            },
            crystal: {
                baseCost: 5_000,
                increaseFactor: 1.8,
            },
            deuterium: {
                baseCost: 800,
                increaseFactor: 1.8,
            },
            energy: {
                baseCost: 15,
                increaseFactor: 1.3,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.hallsOfRealisation;
    }
}

export const HallsOfRealisation = new HallsOfRealisationClass();
