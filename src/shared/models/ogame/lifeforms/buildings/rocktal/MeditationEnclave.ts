import { LifeformBonusType } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class MeditationEnclaveClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 9,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 3,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 0,
                increaseFactor: 1,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [];
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.meditationEnclave;
    }
}

export const MeditationEnclave = new MeditationEnclaveClass();
