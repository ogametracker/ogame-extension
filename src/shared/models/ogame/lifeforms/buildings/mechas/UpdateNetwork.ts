import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class UpdateNetworkClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 5000,
                increaseFactor: 1.8,
            },
            crystal: {
                baseCost: 3800,
                increaseFactor: 1.8,
            },
            deuterium: {
                baseCost: 1000,
                increaseFactor: 1.8,
            },
            energy: {
                baseCost: 10,
                increaseFactor: 1.2,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.updateNetwork;
    }
}

export const UpdateNetwork = new UpdateNetworkClass();
