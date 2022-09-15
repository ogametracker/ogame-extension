import { Cost } from "../common/Cost";
import { Research } from "./Research";

class ComputerTechnologyClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 0,
            crystal: 200 * 2 ** level,
            deuterium: 300 * 2 ** level,
            energy: 0,
        };
    }

}
export const ComputerTechnology = new ComputerTechnologyClass();
