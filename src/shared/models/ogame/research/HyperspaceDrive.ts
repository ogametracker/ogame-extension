import { Cost } from "../common/Cost";
import { Research } from "./Research";

class HyperspaceDriveClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 5000 * 2 ** level,
            crystal: 10000 * 2 ** level,
            deuterium: 3000 * 2 ** level,
            energy: 0,
        };
    }

}
export const HyperspaceDrive = new HyperspaceDriveClass();
