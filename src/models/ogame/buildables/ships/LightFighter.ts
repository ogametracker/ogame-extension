import Cost from "../Cost";
import Ship from "./Ship";

class LightFighter extends Ship {
    public get cost(): Cost {
        return {
            metal: 3_000,
            crystal: 1_000,
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
        return 50;
    }

    public get speed(): number {
        return 12_500;
    }

    public get cargoCapacity(): number {
         return 50;
    }

    public get fuelConsumption(): number {
        return 20;
    }
}

export default new LightFighter();