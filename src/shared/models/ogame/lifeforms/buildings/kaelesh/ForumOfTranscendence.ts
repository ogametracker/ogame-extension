import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class ForumOfTranscendenceClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 60000,
                increaseFactor: 1.8,
            },
            crystal: {
                baseCost: 30000,
                increaseFactor: 1.8,
            },
            deuterium: {
                baseCost: 50000,
                increaseFactor: 1.8,
            },
            energy: {
                baseCost: 30,
                increaseFactor: 1.3,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.forumOfTranscendence;
    }
}

export const ForumOfTranscendence = new ForumOfTranscendenceClass();
