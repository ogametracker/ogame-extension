import { Cost } from "../common/Cost";
import { Building } from "./Building";
import { BuildingType } from "./BuildingType";

class ResearchLabClass extends Building {

    public get type() {
        return BuildingType.researchLab;
    }

    public getCost(level: number): Cost {
        return {
            metal: 100 * 2 ** level,
            crystal: 200 * 2 ** level,
            deuterium: 100 * 2 ** level,
            energy: 0,
        };
    }
}

export const ResearchLab = new ResearchLabClass();
