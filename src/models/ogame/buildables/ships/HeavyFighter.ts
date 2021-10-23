import Cost from "../Cost";
import Ship from "./Ship";

class HeavyFighter extends Ship {
    public get cost(): Cost {
        return {
            metal: 6_000,
            crystal: 4_000,
            deuterium: 0,
            energy: 0,
        };
    }

    public get armor(): number {
        return 10_000;
    }

    public get shield(): number {
        return 25;
    }

    public get damage(): number {
        return 15;
    }

    public get speed(): number {
        return 10_000;
    }

    public get cargoCapacity(): number {
         return 100;
    }

    public get fuelConsumption(): number {
        return 75;
    }
}

export default new HeavyFighter();