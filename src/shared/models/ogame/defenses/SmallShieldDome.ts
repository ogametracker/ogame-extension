import { Cost } from "../common/Cost";
import { Defense } from "./Defense";
import { DefenseType } from "./DefenseType";

class SmallShieldDomeClass extends Defense {

    public get type() { 
        return DefenseType.smallShieldDome;
    }

    public get cost(): Cost {
        return {
            metal: 10_000,
            crystal: 10_000,
            deuterium: 0,
            energy: 0,
        };
    }

    public get baseHull(): number {
        return 20_000;
    }

    public get baseShield(): number {
        return 2_000;
    }

    public get baseDamage(): number {
        return 1;
    }
}

export const SmallShieldDome = new SmallShieldDomeClass();