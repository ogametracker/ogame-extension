import { Cost } from "../common/Cost";
import { Ship } from "./Ship";
import { ShipType } from "./ShipType";

class ReaperClass extends Ship {

    public get type() { 
        return ShipType.reaper;
    }

    public get cost(): Cost {
        return {
            metal: 85_000,
            crystal: 55_000,
            deuterium: 20_000,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 140_000;
    }

    public baseShield(): number {
        return 700;
    }

    public baseDamage(): number {
        return 2_800;
    }

    public baseSpeed(): number {
         return 7_000;
    }

    public baseCargoCapacity(): number {
        return 10_000;
    }

    public fuelConsumption(): number {
        return 1_100;
    }
}

export const Reaper = new ReaperClass();