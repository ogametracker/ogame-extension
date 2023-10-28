import { Cost } from "../common/Cost";
import { Ship } from "./Ship";
import { ShipType } from "./ShipType";

class EspionageProbeClass extends Ship {

    public get type() { 
        return ShipType.espionageProbe;
    }

    public get cost(): Cost {
        return {
            metal: 0,
            crystal: 1_000,
            deuterium: 0,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 1_000;
    }

    public baseShield(): number {
        return 0;
    }

    public baseDamage(): number {
        return 0;
    }

    public baseSpeed(): number {
         return 100_000_000;
    }

    public baseCargoCapacity(): number {
        return 0; //TODO: depends on server settings
    }

    public fuelConsumption(): number {
        return 1;
    }
}

export const EspionageProbe = new EspionageProbeClass();