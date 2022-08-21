import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class AdvancedRecyclingPlantClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 250_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 125_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 125_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 100,
                increaseFactor: 1.1,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.advancedRecyclingPlant;
    }
}

export const AdvancedRecyclingPlant = new AdvancedRecyclingPlantClass();
