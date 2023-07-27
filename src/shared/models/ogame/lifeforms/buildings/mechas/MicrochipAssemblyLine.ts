import { LifeformBonusType } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class MicrochipAssemblyLineClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 50_000,
                increaseFactor: 1.07,
            },
            crystal: {
                baseCost: 20_000,
                increaseFactor: 1.07,
            },
            deuterium: {
                baseCost: 30_000,
                increaseFactor: 1.07,
            },
            energy: {
                baseCost: 40,
                increaseFactor: 1.01,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [];
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.microchipAssemblyLine;
    }
}

export const MicrochipAssemblyLine = new MicrochipAssemblyLineClass();
