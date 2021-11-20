import Cost from "../Cost";
import Ship from "./Ship";

class Battleship extends Ship {
    public get cost(): Cost {
        return {
            metal: 45_000,
            crystal: 15_000,
            deuterium: 0,
            energy: 0,
        };
    }

    public get armor(): number {
        return 60_000;
    }

    public get shield(): number {
        return 200;
    }

    public get damage(): number {
        return 1_000;
    }

    public get speed(): number {
        return 10_000;
    }

    public get cargoCapacity(): number {
         return 1_500;
    }

    public get fuelConsumption(): number {
        return 500;
    }
}

export default new Battleship();