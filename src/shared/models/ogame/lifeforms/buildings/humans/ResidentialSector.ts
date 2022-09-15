import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class ResidentialSectorClass extends LifeformBuilding {
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
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }
    
    public get type(): LifeformBuildingType {
        return LifeformBuildingType.residentialSector;
    }
}

export const ResidentialSector = new ResidentialSectorClass();