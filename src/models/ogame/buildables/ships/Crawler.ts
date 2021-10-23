import Cost from "../Cost";
import Ship from "./Ship";

class Crawler extends Ship {
    public get cost(): Cost {
        return {
            metal: 2_000,
            crystal: 2_000,
            deuterium: 1_000,
            energy: 0,
        };
    }

    public get armor(): number {
        return 4_000;
    }

    public get shield(): number {
        return 1;
    }

    public get damage(): number {
        return 1;
    }

    public get speed(): number {
        return 0;
    }

    public get cargoCapacity(): number {
         return 0; 
    }

    public get fuelConsumption(): number {
        return 0;
    }
}

export default new Crawler();