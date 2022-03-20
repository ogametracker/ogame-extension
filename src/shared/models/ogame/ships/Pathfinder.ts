import { Cost } from "../common/Cost";
import { Ship } from "./Ship";

class PathfinderClass extends Ship {

    public getCost(): Cost {
        return {
            metal: 8_000,
            crystal: 15_000,
            deuterium: 8_000,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 23_000;
    }

    public baseShield(): number {
        return 100;
    }

    public baseDamage(): number {
        return 200;
    }

    public baseSpeed(): number {
         return 12_000;
    }

    public baseCargoCapacity(): number {
        return 10_000;
    }

    public fuelConsumption(): number {
        return 300;
    }
}

export const Pathfinder = new PathfinderClass();