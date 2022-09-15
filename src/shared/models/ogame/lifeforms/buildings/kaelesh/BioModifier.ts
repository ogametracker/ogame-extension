import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class BioModifierClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 87_500,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 25_000,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 30_000,
                increaseFactor: 1.2,
            },
            energy: {
                baseCost: 40,
                increaseFactor: 1.02,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.bioModifier;
    }
}

export const BioModifier = new BioModifierClass();
