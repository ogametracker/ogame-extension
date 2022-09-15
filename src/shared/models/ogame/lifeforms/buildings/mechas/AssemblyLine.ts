import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class AssemblyLineClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 6,
                increaseFactor: 1.21,
            },
            crystal: {
                baseCost: 2,
                increaseFactor: 1.21,
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
        return LifeformBuildingType.assemblyLine;
    }
}

export const AssemblyLine = new AssemblyLineClass();
