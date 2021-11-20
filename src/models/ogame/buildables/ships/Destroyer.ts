import Cost from "../Cost";
import Ship from "./Ship";

class Destroyer extends Ship {
    public get cost(): Cost {
        return {
            metal: 60_000,
            crystal: 50_000,
            deuterium: 15_000,
            energy: 0,
        };
    }

    public get armor(): number {
        return 110_000;
    }

    public get shield(): number {
        return 500;
    }

    public get damage(): number {
        return 2_000;
    }

    public get speed(): number {
        return 5_000;
    }

    public get cargoCapacity(): number {
         return 2_000;
    }

    public get fuelConsumption(): number {
        return 1_000;
    }
}

export default new Destroyer();