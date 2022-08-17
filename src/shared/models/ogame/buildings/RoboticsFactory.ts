import { Cost } from "../common/Cost";
import { Building } from "./Building";
import { BuildingType } from "./BuildingType";

class RoboticsFactoryClass extends Building {

    public get type() {
        return BuildingType.roboticsFactory;
    }

    public getCost(level: number): Cost {
        return {
            metal: 200 * 2 ** level,
            crystal: 60 * 2 ** level,
            deuterium: 100 * 2 ** level,
            energy: 0,
        };
    }
}

export const RoboticsFactory = new RoboticsFactoryClass();
