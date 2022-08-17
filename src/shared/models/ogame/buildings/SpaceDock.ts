import { Cost } from "../common/Cost";
import { Building } from "./Building";
import { BuildingType } from "./BuildingType";

class SpaceDockClass extends Building {

    public get type() {
        return BuildingType.spaceDock;
    }

    public getCost(level: number): Cost {
        return {
            metal: 40 * 4 ** level,
            crystal: 0,
            deuterium: 10 * 5 ** level,
            energy: 10 * 5 ** level,
        };
    }
}

export const SpaceDock = new SpaceDockClass();
