import Cost from "../Cost";
import Ship from "./Ship";

class Pathfinder extends Ship {
    public get cost(): Cost {
        return {
            metal: 8_000,
            crystal: 15_000,
            deuterium: 8_000,
            energy: 0,
        };
    }

    public get armor(): number {
        return 23_000;
    }

    public get shield(): number {
        return 100;
    }

    public get damage(): number {
        return 200;
    }

    public get speed(): number {
        return 12_000;
    }

    public get cargoCapacity(): number {
         return 10_000;
    }

    public get fuelConsumption(): number {
        return 300;
    }
}

export default new Pathfinder();