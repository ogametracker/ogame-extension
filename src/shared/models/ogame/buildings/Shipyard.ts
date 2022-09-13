import { Cost } from "../common/Cost";
import { Building } from "./Building";
import { BuildingType } from "./BuildingType";

class ShipyardClass extends Building {

    public get type() {
        return BuildingType.shipyard;
    }

    public getCost(level: number): Cost {
        return {
            metal: 200 * 2 ** level,
            crystal: 100 * 2 ** level,
            deuterium: 50 * 2 ** level,
            energy: 0,
        };
    }
}

export const Shipyard = new ShipyardClass();
