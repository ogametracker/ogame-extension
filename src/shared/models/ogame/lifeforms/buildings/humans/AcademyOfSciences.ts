import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class AcademyOfSciencesClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 5_000,
                increaseFactor: 1.7,
            },
            crystal: {
                baseCost: 3_200,
                increaseFactor: 1.7,
            },
            deuterium: {
                baseCost: 1_500,
                increaseFactor: 1.7,
            },
            energy: {
                baseCost: 15,
                increaseFactor: 1.25,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.academyOfSciences;
    }
}

export const AcademyOfSciences = new AcademyOfSciencesClass();
