import { Cost } from "../common/Cost";
import { Ship } from "./Ship";

class RecyclerClass extends Ship {

    public getCost(): Cost {
        return {
            metal: 10_000,
            crystal: 6_000,
            deuterium: 2_000,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 16_000;
    }

    public baseShield(): number {
        return 10;
    }

    public baseDamage(): number {
        return 1;
    }

    public baseSpeed(): number {
         return 6_000;
    }

    public baseCargoCapacity(): number {
        return 20_000;
    }

    public fuelConsumption(): number {
        return 900;
    }
}

export const Recycler = new RecyclerClass();