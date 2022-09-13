import { Cost } from "../common/Cost";
import { Defense } from "./Defense";

class BallisticMissileClass extends Defense {

    public get cost(): Cost {
        return {
            metal: 8_000,
            crystal: 0,
            deuterium: 2_000,
            energy: 0,
        };
    }

    public get baseHull(): number {
        return 8_000;
    }

    public get baseShield(): number {
        return 1;
    }

    public get baseDamage(): number {
        return 1;
    }
}

export const BallisticMissile = new BallisticMissileClass();