import { Cost } from "../common/Cost";
import { Ship } from "./Ship";

class LargeCargoClass extends Ship {

    public getCost(): Cost {
        return {
            metal: 6_000,
            crystal: 6_000,
            deuterium: 0,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 12_000;
    }

    public baseShield(): number {
        return 25;
    }

    public baseDamage(): number {
        return 5;
    }

    public baseSpeed(): number {
         return 7_500;
    }

    public baseCargoCapacity(): number {
        return 25_000;
    }

    public fuelConsumption(): number {
        return 50;
    }
}

export const LargeCargo = new LargeCargoClass();