import Cost from "../Cost";
import Ship from "./Ship";

class SolarSatellite extends Ship {
    public get cost(): Cost {
        return {
            metal: 0,
            crystal: 2_000,
            deuterium: 500,
            energy: 0,
        };
    }

    public get armor(): number {
        return 2_000;
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

export default new SolarSatellite();