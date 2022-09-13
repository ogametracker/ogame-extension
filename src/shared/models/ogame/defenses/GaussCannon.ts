import { Cost } from "../common/Cost";
import { Defense } from "./Defense";

class GaussCannonClass extends Defense {

    public get cost(): Cost {
        return {
            metal: 20_000,
            crystal: 15_000,
            deuterium: 2_000,
            energy: 0,
        };
    }

    public get baseHull(): number {
        return 35_000;
    }

    public get baseShield(): number {
        return 200;
    }

    public get baseDamage(): number {
        return 1_100;
    }
}

export const GaussCannon = new GaussCannonClass();