import { Cost } from "../common/Cost";
import { Defense } from "./Defense";

class LightLaserClass extends Defense {

    public get cost(): Cost {
        return {
            metal: 1_500,
            crystal: 500,
            deuterium: 0,
            energy: 0,
        };
    }

    public get baseHull(): number {
        return 2_000;
    }

    public get baseShield(): number {
        return 25;
    }

    public get baseDamage(): number {
        return 100;
    }
}

export const LightLaser = new LightLaserClass();