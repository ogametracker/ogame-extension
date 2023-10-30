import { Cost } from "../common/Cost";
import { Defense } from "./Defense";
import { DefenseType } from "./DefenseType";

class HeavyLaserClass extends Defense {

    public get type() { 
        return DefenseType.heavyLaser;
    }

    public get cost(): Cost {
        return {
            metal: 6_000,
            crystal: 2_000,
            deuterium: 0,
            energy: 0,
        };
    }

    public get baseHull(): number {
        return 8_000;
    }

    public get baseShield(): number {
        return 100;
    }

    public get baseDamage(): number {
        return 250;
    }
}

export const HeavyLaser = new HeavyLaserClass();