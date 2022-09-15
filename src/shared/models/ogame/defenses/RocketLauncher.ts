import { Cost } from "../common/Cost";
import { Defense } from "./Defense";

class RocketLauncherClass extends Defense {

    public get cost(): Cost {
        return {
            metal: 2_000,
            crystal: 0,
            deuterium: 0,
            energy: 0,
        };
    }

    public get baseHull(): number {
        return 2_000;
    }

    public get baseShield(): number {
        return 20;
    }

    public get baseDamage(): number {
        return 80;
    }
}

export const RocketLauncher = new RocketLauncherClass();