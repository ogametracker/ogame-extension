import Cost from "../Cost";
import Ship from "./Ship";

class EspionageProbe extends Ship {
    public get cost(): Cost {
        return {
            metal: 0,
            crystal: 1_000,
            deuterium: 0,
            energy: 0,
        };
    }

    public get armor(): number {
        return 1_000;
    }

    public get shield(): number {
        return 0;
    }

    public get damage(): number {
        return 0;
    }

    public get speed(): number {
        return 100_000_000;
    }

    public get cargoCapacity(): number {
         return 0; //TODO: based on server setting
    }

    public get fuelConsumption(): number {
        return 1;
    }
}

export default new EspionageProbe();