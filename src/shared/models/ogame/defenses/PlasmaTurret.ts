import { Cost } from "../common/Cost";
import { Defense } from "./Defense";

class PlasmaTurretClass extends Defense {

    public get cost(): Cost {
        return {
            metal: 50_000,
            crystal: 50_000,
            deuterium: 30_000,
            energy: 0,
        };
    }

    public get baseHull(): number {
        return 100_000;
    }

    public get baseShield(): number {
        return 300;
    }

    public get baseDamage(): number {
        return 3_000;
    }
}

export const PlasmaTurret = new PlasmaTurretClass();