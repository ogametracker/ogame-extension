import { Cost } from "../common/Cost";
import { Building } from "./Building";
import { BuildingType } from "./BuildingType";

class JumpGateClass extends Building {

    public get type() {
        return BuildingType.jumpGate;
    }

    public getCost(level: number): Cost {
        return {
            metal: 1_000_000 * 2 ** level,
            crystal: 2_000_000 * 2 ** level,
            deuterium: 1_000_000 * 2 ** level,
            energy: 0,
        };
    }
}

export const JumpGate = new JumpGateClass();
