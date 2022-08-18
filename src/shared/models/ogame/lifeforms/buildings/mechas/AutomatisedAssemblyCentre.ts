import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class AutomatisedAssemblyCentreClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 7500,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 7000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 1000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.automatisedAssemblyCentre;
    }
}

export const AutomatisedAssemblyCentre = new AutomatisedAssemblyCentreClass();
