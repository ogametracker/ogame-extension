import { Cost } from "../common/Cost";
import { Research } from "./Research";

class ImpulseDriveClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 1000 * 2 ** level,
            crystal: 2000 * 2 ** level,
            deuterium: 300 * 2 ** level,
            energy: 0,
        };
    }

}
export const ImpulseDrive = new ImpulseDriveClass();
