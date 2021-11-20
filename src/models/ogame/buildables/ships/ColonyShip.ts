import Cost from "../Cost";
import Ship from "./Ship";

class ColonyShip extends Ship {
    public get cost(): Cost {
        return {
            metal: 10_000,
            crystal: 20_000,
            deuterium: 10_000,
            energy: 0,
        };
    }

    public get armor(): number {
        return 30_000;
    }

    public get shield(): number {
        return 100;
    }

    public get damage(): number {
        return 50;
    }

    public get speed(): number {
        return 2_500;
    }

    public get cargoCapacity(): number {
         return 7_500;
    }

    public get fuelConsumption(): number {
        return 1_000;
    }
}

export default new ColonyShip();