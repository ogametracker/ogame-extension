import { Cost } from "../common/Cost";
import { Research } from "./Research";

class EspionageTechnologyClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 100 * 2 ** level,
            crystal: 500 * 2 ** level,
            deuterium: 100 * 2 ** level,
            energy: 0,
        };
    }

}
export const EspionageTechnology = new EspionageTechnologyClass();
