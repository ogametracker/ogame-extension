import { Cost } from "../common/Cost";
import { Building } from "./Building";
import { BuildingType } from "./BuildingType";

class LunarBaseClass extends Building {

    public get type() {
        return BuildingType.lunarBase;
    }

    public getCost(level: number): Cost {
        return {
            metal: 10_000 * 2 ** level,
            crystal: 20_000 * 2 ** level,
            deuterium: 10_000 * 2 ** level,
            energy: 0,
        };
    }
}

export const LunarBase = new LunarBaseClass();
