import { Cost } from "../common/Cost";
import { Research } from "./Research";

class EnergyTechnologyClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 0,
            crystal: 400 * 2 ** level,
            deuterium: 200 * 2 ** level,
            energy: 0,
        };
    }

}
export const EnergyTechnology = new EnergyTechnologyClass();
