import { Cost } from "../common/Cost";
import { Research } from "./Research";

class WeaponsTechnologyClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 400 * 2 ** level,
            crystal: 100 * 2 ** level,
            deuterium: 0,
            energy: 0,
        };
    }

}
export const WeaponsTechnology = new WeaponsTechnologyClass();
