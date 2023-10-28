import { Cost } from "../common/Cost";
import { Ship } from "./Ship";
import { ShipType } from "./ShipType";

class SmallCargoClass extends Ship {

    public get type() { 
        return ShipType.smallCargo;
    }

    public get cost(): Cost {
        return {
            metal: 2_000,
            crystal: 2_000,
            deuterium: 0,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 4_000;
    }

    public baseShield(): number {
        return 10;
    }

    public baseDamage(): number {
        return 5;
    }

    public baseSpeed(): number {
         return 10_000;
    }

    public baseCargoCapacity(): number {
        return 5_000;
    }

    public fuelConsumption(): number {
        return 20;
    }
}

export const SmallCargo = new SmallCargoClass();