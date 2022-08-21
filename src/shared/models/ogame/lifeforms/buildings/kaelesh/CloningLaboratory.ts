import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class CloningLaboratoryClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 15_000,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 15_000,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 20_000,
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
