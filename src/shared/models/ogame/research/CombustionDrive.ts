import { Cost } from "../common/Cost";
import { Research } from "./Research";

class CombustionDriveClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 200 * 2 ** level,
            crystal: 0,
            deuterium: 300 * 2 ** level,
            energy: 0,
        };
    }

}
export const CombustionDrive = new CombustionDriveClass();
