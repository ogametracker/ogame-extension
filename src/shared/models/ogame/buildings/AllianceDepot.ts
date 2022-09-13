import { Cost } from "../common/Cost";
import { Building } from "./Building";
import { BuildingType } from "./BuildingType";

class AllianceDepotClass extends Building {

    public get type() {
        return BuildingType.allianceDepot;
    }

    public getCost(level: number): Cost {
        return {
            metal: 10_000 * 2 ** level,
            crystal: 20_000 * 2 ** level,
            deuterium: 0,
            energy: 0,
        };
    }
}

export const AllianceDepot = new AllianceDepotClass();
