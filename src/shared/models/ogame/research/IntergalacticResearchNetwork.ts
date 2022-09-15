import { Cost } from "../common/Cost";
import { Research } from "./Research";

class IntergalacticResearchNetworkClass extends Research {

    public getCost(level: number): Cost {
        return {
            metal: 120000 * 2 ** level,
            crystal: 200000 * 2 ** level,
            deuterium: 80000 * 2 ** level,
            energy: 0,
        };
    }

}
export const IntergalacticResearchNetwork = new IntergalacticResearchNetworkClass();
