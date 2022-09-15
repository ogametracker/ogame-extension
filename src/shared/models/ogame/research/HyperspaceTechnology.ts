import { Cost } from "../common/Cost";
import { Research } from "./Research";

class HyperspaceTechnologyClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 0,
            crystal: 2000 * 2 ** level,
            deuterium: 1000 * 2 ** level,
            energy: 0,
        };
    }

}
export const HyperspaceTechnology = new HyperspaceTechnologyClass();
