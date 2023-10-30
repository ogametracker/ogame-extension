import { Cost } from "../common/Cost";
import { Ship } from "./Ship";
import { ShipType } from "./ShipType";

class SolarSatelliteClass extends Ship {

    public get type() { 
        return ShipType.solarSatellite;
    }

    public get cost(): Cost {
        return {
            metal: 0,
            crystal: 2_000,
            deuterium: 500,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 2_000;
    }

    public baseShield(): number {
        return 1;
    }

    public baseDamage(): number {
        return 1;
    }

    public baseSpeed(): number {
         return 0;
    }

    public baseCargoCapacity(): number {
        return 0;
    }

    public fuelConsumption(): number {
        return 0;
    }
}

export const SolarSatellite = new SolarSatelliteClass();