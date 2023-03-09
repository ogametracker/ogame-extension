import { Cost } from "../common/Cost";
import { Research } from "./Research";

class AstrophysicsClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: Math.floor(100 * 40 * 1.75 ** (level - 1)),
            crystal: Math.floor(100 * 80 * 1.75 ** (level - 1)),
            deuterium: Math.floor(100 * 40 * 1.75 ** (level - 1)),
            energy: 0,
        };
    }

}
export const Astrophysics = new AstrophysicsClass();