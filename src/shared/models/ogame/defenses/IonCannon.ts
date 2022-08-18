import { Cost } from "../common/Cost";
import { Defense } from "./Defense";

class IonCannonClass extends Defense {

    public get cost(): Cost {
        return {
            metal: 5_000,
            crystal: 3_000,
            deuterium: 0,
            energy: 0,
        };
    }

    public get baseHull(): number {
        return 8_000;
    }

    public get baseShield(): number {
        return 500;
    }

    public get baseDamage(): number {
        return 150;
    }
}

export const IonCannon = new IonCannonClass();