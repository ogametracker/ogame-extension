import Cost from "../Cost";
import Ship from "./Ship";

class Recycler extends Ship {
    public get cost(): Cost {
        return {
            metal: 10_000,
            crystal: 6_000,
            deuterium: 2_000,
            energy: 0,
        };
    }

    public get armor(): number {
        return 16_000;
    }

    public get shield(): number {
        return 10;
    }

    public get damage(): number {
        return 1;
    }

    public get speed(): number {
        return 6_000;
    }

    public get cargoCapacity(): number {
         return 20_000;
    }

    public get fuelConsumption(): number {
        return 900;
    }
}

export default new Recycler();