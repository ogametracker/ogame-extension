import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class CrystalFarmClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 7,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 2,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 0,
                increaseFactor: 1,
            },
            energy: {
                baseCost: 10,
                increaseFactor: 1.03,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.crystalFarm;
    }
}

export const CrystalFarm = new CrystalFarmClass();
