import { LifeformBonusType } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class SupraRefractorClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 500_000,
                increaseFactor: 1.4,
            },
            crystal: {
                baseCost: 250_000,
                increaseFactor: 1.4,
            },
            deuterium: {
                baseCost: 250_000,
                increaseFactor: 1.4,
            },
            energy: {
                baseCost: 100,
                increaseFactor: 1.05,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [];
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.supraRefractor;
    }
}

export const SupraRefractor = new SupraRefractorClass();
