import { Cost } from "../common/Cost";
import { Ship } from "./Ship";
import { ShipType } from "./ShipType";

class HeavyFighterClass extends Ship {

    public get type() { 
        return ShipType.heavyFighter;
    }

    public get cost(): Cost {
        return {
            metal: 6_000,
            crystal: 4_000,
            deuterium: 0,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 10_000;
    }

    public baseShield(): number {
        return 25;
    }

    public baseDamage(): number {
        return 150;
    }

    public baseSpeed(): number {
         return 10_000;
    }

    public baseCargoCapacity(): number {
        return 100;
    }

    public fuelConsumption(): number {
        return 75;
    }
}

export const HeavyFighter = new HeavyFighterClass();