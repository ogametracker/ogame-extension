import { Cost } from "../common/Cost";
import { Missile } from "./Missile";

class AntiBallisticMissileClass extends Missile {

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

export const AntiBallisticMissile = new AntiBallisticMissileClass();