import { Cost } from "../common/Cost";
import { Building } from "./Building";
import { BuildingType } from "./BuildingType";

class SensorPhalanxClass extends Building {

    public get type() {
        return BuildingType.sensorPhalanx;
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

export const SensorPhalanx = new SensorPhalanxClass();
