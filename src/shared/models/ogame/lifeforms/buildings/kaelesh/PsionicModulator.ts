import { LifeformBonusType } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class PsionicModulatorClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 150_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 30_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 30_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 140,
                increaseFactor: 1.05,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [];
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.psionicModulator;
    }
}

export const PsionicModulator = new PsionicModulatorClass();
