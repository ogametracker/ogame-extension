import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class NanoRepairBotsClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 250000,
                increaseFactor: 1.4,
            },
            crystal: {
                baseCost: 125000,
                increaseFactor: 1.4,
            },
            deuterium: {
                baseCost: 125000,
                increaseFactor: 1.4,
            },
            energy: {
                baseCost: 100,
                increaseFactor: 1.05,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.nanoRepairBots;
    }
}

export const NanoRepairBots = new NanoRepairBotsClass();
