import { Cost } from "../common/Cost";
import { Building } from "./Building";
import { BuildingType } from "./BuildingType";

class MissileSiloClass extends Building {

    public get type() {
        return BuildingType.missileSilo;
    }

    public getCost(level: number): Cost {
        return {
            metal: 10_000 * 2 ** level,
            crystal: 10_000 * 2 ** level,
            deuterium: 500 * 2 ** level,
            energy: 0,
        };
    }
}

export const MissileSilo = new MissileSiloClass();
