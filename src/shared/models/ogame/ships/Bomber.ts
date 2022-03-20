import { Cost } from "../common/Cost";
import { Ship } from "./Ship";

class BomberClass extends Ship {

    public getCost(): Cost {
        return {
            metal: 50_000,
            crystal: 25_000,
            deuterium: 15_000,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 75_000;
    }

    public baseShield(): number {
        return 500;
    }

    public baseDamage(): number {
        return 1_000;
    }

    public baseSpeed(): number {
         return 5_000;
    }

    public baseCargoCapacity(): number {
        return 500;
    }

    public fuelConsumption(): number {
        return 700;
    }
}

export const Bomber = new BomberClass();