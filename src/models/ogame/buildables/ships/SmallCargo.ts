import Cost from "../Cost";
import Ship from "./Ship";

class SmallCargo extends Ship {
    public get cost(): Cost {
        return {
            metal: 2_000,
            crystal: 2_000,
            deuterium: 0,
            energy: 0,
        };
    }

    public get armor(): number {
        return 4_000;
    }

    public get shield(): number {
        return 10;
    }

    public get damage(): number {
        return 5;
    }

    public get speed(): number {
        return 10_000;
    }

    public get cargoCapacity(): number {
         return 5_000;
    }

    public get fuelConsumption(): number {
        return 20;
    }
}

export default new SmallCargo();