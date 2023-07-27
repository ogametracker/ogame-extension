import { LifeformBonusType } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class AutomatisedAssemblyCentreClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 7_500,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 7_000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 1_000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [];
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.automatisedAssemblyCentre;
    }
}

export const AutomatisedAssemblyCentre = new AutomatisedAssemblyCentreClass();
