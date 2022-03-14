import { Cost } from "../common/Cost";
import { Research } from "./Research";

class PlasmaTechnologyClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 1_000 * 2 ** level,
            crystal: 2_000 * 2 ** level,
            deuterium: 500 * 2 ** level,
            energy: 0,
        };
    }

}
export const PlasmaTechnology = new PlasmaTechnologyClass();