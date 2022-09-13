import { Cost } from "../common/Cost";
import { Building } from "./Building";
import { BuildingType } from "./BuildingType";

class TerraformerClass extends Building {

    public get type() {
        return BuildingType.terraformer;
    }

    public getCost(level: number): Cost {
        return {
            metal: 0,
            crystal: 25_000 * 2 ** level,
            deuterium: 50_000 * 2 ** level,
            energy: 500 * 2 ** level,
        };
    }
}

export const Terraformer = new TerraformerClass();
