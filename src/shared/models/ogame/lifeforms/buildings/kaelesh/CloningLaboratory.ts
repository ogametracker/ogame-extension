import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class CloningLaboratoryClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 15000,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 15000,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 20000,
                increaseFactor: 1.2,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.cloningLaboratory;
    }
}

export const CloningLaboratory = new CloningLaboratoryClass();
