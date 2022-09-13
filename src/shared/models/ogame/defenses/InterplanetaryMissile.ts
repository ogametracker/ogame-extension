import { Cost } from "../common/Cost";
import { Defense } from "./Defense";

class InterplanetaryMissileClass extends Defense {

    public get cost(): Cost {
        return {
            metal: 12_500,
            crystal: 2_500,
            deuterium: 10_000,
            energy: 0,
        };
    }

    public get baseHull(): number {
        return 12_000;
    }

    public get baseShield(): number {
        return 1;
    }

    public get baseDamage(): number {
        return 12_000;
    }
}

export const InterplanetaryMissile = new InterplanetaryMissileClass();