import { Cost } from "../common/Cost";
import { Building } from "./Building";
import { BuildingType } from "./BuildingType";

class NaniteFactoryClass extends Building {

    public get type() {
        return BuildingType.naniteFactory;
    }

    public getCost(level: number): Cost {
        return {
            metal: 500_000 * 2 ** level,
            crystal: 250_000 * 2 ** level,
            deuterium: 50_000 * 2 ** level,
            energy: 0,
        };
    }
}

export const NaniteFactory = new NaniteFactoryClass();
