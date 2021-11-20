import Cost from "../Cost";
import Ship from "./Ship";

class Bomber extends Ship {
    public get cost(): Cost {
        return {
            metal: 50_000,
            crystal: 25_000,
            deuterium: 15_000,
            energy: 0,
        };
    }

    public get armor(): number {
        return 75_000;
    }

    public get shield(): number {
        return 500;
    }

    public get damage(): number {
        return 1_000;
    }

    public get speed(): number {
        return 5_000;
    }

    public get cargoCapacity(): number {
         return 500;
    }

    public get fuelConsumption(): number {
        return 700;
    }
}

export default new Bomber();