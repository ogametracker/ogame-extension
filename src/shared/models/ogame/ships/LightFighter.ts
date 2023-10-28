import { Cost } from "../common/Cost";
import { Ship } from "./Ship";
import { ShipType } from "./ShipType";

class LightFighterClass extends Ship {

    public get type() { 
        return ShipType.lightFighter;
    }

    public get cost(): Cost {
        return {
            metal: 3_000,
            crystal: 1_000,
            deuterium: 0,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 4_000;
    }

    public baseShield(): number {
        return 10;
    }

    public baseDamage(): number {
        return 50;
    }

    public baseSpeed(): number {
         return 12_500;
    }

    public baseCargoCapacity(): number {
        return 50;
    }

    public fuelConsumption(): number {
        return 20;
    }
}

export const LightFighter = new LightFighterClass();