import { Cost } from "../common/Cost";
import { Ship } from "./Ship";

class BattlecruiserClass extends Ship {

    public getCost(): Cost {
        return {
            metal: 30_000,
            crystal: 40_000,
            deuterium: 15_000,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 70_000;
    }

    public baseShield(): number {
        return 400;
    }

    public baseDamage(): number {
        return 700;
    }

    public baseSpeed(): number {
         return 10_000;
    }

    public baseCargoCapacity(): number {
        return 750;
    }

    public fuelConsumption(): number {
        return 250;
    }
}

export const Battlecruiser = new BattlecruiserClass();