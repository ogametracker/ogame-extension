import { Cost } from "../common/Cost";
import { Defense } from "./Defense";
import { DefenseType } from "./DefenseType";

class LargeShieldDomeClass extends Defense {

    public get type() { 
        return DefenseType.largeShieldDome;
    }

    public get cost(): Cost {
        return {
            metal: 50_000,
            crystal: 50_000,
            deuterium: 0,
            energy: 0,
        };
    }

    public get baseHull(): number {
        return 100_000;
    }

    public get baseShield(): number {
        return 10_000;
    }

    public get baseDamage(): number {
        return 1;
    }
}

export const LargeShieldDome = new LargeShieldDomeClass();