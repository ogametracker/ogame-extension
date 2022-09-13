import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class FusionCellFactoryClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 5,
                increaseFactor: 1.18,
            },
            crystal: {
                baseCost: 2,
                increaseFactor: 1.18,
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
        return LifeformBuildingType.fusionCellFactory;
    }
}

export const FusionCellFactory = new FusionCellFactoryClass();
