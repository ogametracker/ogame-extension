import { Cost } from "../common/Cost";
import { Research } from "./Research";

class ArmorTechnologyClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 500 * 2 ** level,
            crystal: 0,
            deuterium: 0,
            energy: 0,
        };
    }

}
export const ArmorTechnology = new ArmorTechnologyClass();
