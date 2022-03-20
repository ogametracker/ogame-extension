import { Cost } from "../common/Cost";
import { Ship } from "./Ship";

class CruiserClass extends Ship {

    public getCost(): Cost {
        return {
            metal: 20_000,
            crystal: 7_000,
            deuterium: 2_000,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 27_000;
    }

    public baseShield(): number {
        return 50;
    }

    public baseDamage(): number {
        return 400;
    }

    public baseSpeed(): number {
         return 15_000;
    }

    public baseCargoCapacity(): number {
        return 800;
    }

    public fuelConsumption(): number {
        return 300;
    }
}

export const Cruiser = new CruiserClass();