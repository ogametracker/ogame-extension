import { Cost } from "../common/Cost";
import { Research } from "./Research";

class IonTechnologyClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 500 * 2 ** level,
            crystal: 150 * 2 ** level,
            deuterium: 50 * 2 ** level,
            energy: 0,
        };
    }

}
export const IonTechnology = new IonTechnologyClass();
