import { Cost } from "../common/Cost";
import { Ship } from "./Ship";

class DestroyerClass extends Ship {

    public getCost(): Cost {
        return {
            metal: 60_000,
            crystal: 50_000,
            deuterium: 15_000,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 110_000;
    }

    public baseShield(): number {
        return 500;
    }

    public baseDamage(): number {
        return 2_000;
    }

    public baseSpeed(): number {
         return 5_000;
    }

    public baseCargoCapacity(): number {
        return 2_000;
    }

    public fuelConsumption(): number {
        return 1_000;
    }
}

export const Destroyer = new DestroyerClass();