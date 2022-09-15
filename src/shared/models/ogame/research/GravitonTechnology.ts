import { Cost } from "../common/Cost";
import { Research } from "./Research";

class GravitonTechnologyClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: 100000 * 3 ** level,
        };
    }

}
export const GravitonTechnology = new GravitonTechnologyClass();
