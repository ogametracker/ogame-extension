import { Cost } from "../common/Cost";
import { Research } from "./Research";

class AstrophysicsClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 100 * Math.floor(0.5 + 40 * 1.75 ** (level - 1)),
            crystal: 100 * Math.floor(0.5 + 80 * 1.75 ** (level - 1)),
            deuterium: 100 * Math.floor(0.5 + 40 * 1.75 ** (level - 1)),
            energy: 0,
        };
    }

}
export const Astrophysics = new AstrophysicsClass();