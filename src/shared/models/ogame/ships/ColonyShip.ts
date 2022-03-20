import { Cost } from "../common/Cost";
import { Ship } from "./Ship";

class ColonyShipClass extends Ship {

    public getCost(): Cost {
        return {
            metal: 10_000,
            crystal: 20_000,
            deuterium: 10_000,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 30_000;
    }

    public baseShield(): number {
        return 100;
    }

    public baseDamage(): number {
        return 50;
    }

    public baseSpeed(): number {
         return 2_500;
    }

    public baseCargoCapacity(): number {
        return 7_500;
    }

    public fuelConsumption(): number {
        return 1_000;
    }
}

export const ColonyShip = new ColonyShipClass();