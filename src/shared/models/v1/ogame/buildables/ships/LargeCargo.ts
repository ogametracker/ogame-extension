import Cost from "../Cost";
import Ship from "./Ship";

class LargeCargo extends Ship {
    public get cost(): Cost {
        return {
            metal: 6_000,
            crystal: 6_000,
            deuterium: 0,
            energy: 0,
        };
    }

    public get armor(): number {
        return 12_000;
    }

    public get shield(): number {
        return 25;
    }

    public get damage(): number {
        return 5;
    }

    public get speed(): number {
        return 7_500;
    }

    public get cargoCapacity(): number {
         return 25_000;
    }

    public get fuelConsumption(): number {
        return 50;
    }
}

export default new LargeCargo();