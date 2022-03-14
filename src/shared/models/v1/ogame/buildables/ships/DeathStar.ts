import Cost from "../Cost";
import Ship from "./Ship";

class DeathStar extends Ship {
    public get cost(): Cost {
        return {
            metal: 5_000_000,
            crystal: 4_000_000,
            deuterium: 1_000_000,
            energy: 0,
        };
    }

    public get armor(): number {
        return 9_000_000;
    }

    public get shield(): number {
        return 50_000;
    }

    public get damage(): number {
        return 200_000;
    }

    public get speed(): number {
        return 100;
    }

    public get cargoCapacity(): number {
         return 1_000_000;
    }

    public get fuelConsumption(): number {
        return 1;
    }
}

export default new DeathStar();