import Cost from "../Cost";
import Ship from "./Ship";

class Battlecruiser extends Ship {
    public get cost(): Cost {
        return {
            metal: 30_000,
            crystal: 45_000,
            deuterium: 15_000,
            energy: 0,
        };
    }

    public get armor(): number {
        return 70_000;
    }

    public get shield(): number {
        return 400;
    }

    public get damage(): number {
        return 700;
    }

    public get speed(): number {
        return 10_000;
    }

    public get cargoCapacity(): number {
         return 750;
    }

    public get fuelConsumption(): number {
        return 250;
    }
}

export default new Battlecruiser();