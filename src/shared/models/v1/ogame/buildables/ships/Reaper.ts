import Cost from "../Cost";
import Ship from "./Ship";

class Reaper extends Ship {
    public get cost(): Cost {
        return {
            metal: 85_000,
            crystal: 55_000,
            deuterium: 20_000,
            energy: 0,
        };
    }

    public get armor(): number {
        return 140_000;
    }

    public get shield(): number {
        return 700;
    }

    public get damage(): number {
        return 2_800;
    }

    public get speed(): number {
        return 7_000;
    }

    public get cargoCapacity(): number {
         return 10_000;
    }

    public get fuelConsumption(): number {
        return 1_100;
    }
}

export default new Reaper();