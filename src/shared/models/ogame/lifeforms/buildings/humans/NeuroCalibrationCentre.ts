import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class NeuroCalibrationCentreClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 50_000,
                increaseFactor: 1.7,
            },
            crystal: {
                baseCost: 40_000,
                increaseFactor: 1.7,
            },
            deuterium: {
                baseCost: 50_000,
                increaseFactor: 1.7,
            },
            energy: {
                baseCost: 30,
                increaseFactor: 1.25,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.neuroCalibrationCentre;
    }
}

export const NeuroCalibrationCentre = new NeuroCalibrationCentreClass();
