import { Cost } from "../common/Cost";
import { Ship } from "./Ship";
import { ShipType } from "./ShipType";

class DeathStarClass extends Ship {

    public get type() { 
        return ShipType.deathStar;
    }

    public get cost(): Cost {
        return {
            metal: 5_000_000,
            crystal: 4_000_000,
            deuterium: 1_000_000,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 9_000_000;
    }

    public baseShield(): number {
        return 50_000;
    }

    public baseDamage(): number {
        return 200_000;
    }

    public baseSpeed(): number {
         return 100;
    }

    public baseCargoCapacity(): number {
        return 1_000_000;
    }

    public fuelConsumption(): number {
        return 1;
    }
}

export const DeathStar = new DeathStarClass();