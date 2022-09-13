import { Cost } from "../common/Cost";
import { Research } from "./Research";

class ShieldingTechnologyClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 100 * 2 ** level,
            crystal: 300 * 2 ** level,
            deuterium: 0,
            energy: 0,
        };
    }

}
export const ShieldingTechnology = new ShieldingTechnologyClass();
