import Cost from "../Cost";
import Ship from "./Ship";

class Cruiser extends Ship {
    public get cost(): Cost {
        return {
            metal: 20_000,
            crystal: 7_000,
            deuterium: 2_000,
            energy: 0,
        };
    }

    public get armor(): number {
        return 27_000;
    }

    public get shield(): number {
        return 50;
    }

    public get damage(): number {
        return 400;
    }

    public get speed(): number {
        return 15_000;
    }

    public get cargoCapacity(): number {
         return 800;
    }

    public get fuelConsumption(): number {
        return 300;
    }
}

export default new Cruiser();