import { Cost } from "../common/Cost";
import { Ship } from "./Ship";
import { ShipType } from "./ShipType";

class BattleshipClass extends Ship {

    public get type() { 
        return ShipType.battleship;
    }

    public get cost(): Cost {
        return {
            metal: 45_000,
            crystal: 15_000,
            deuterium: 0,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 60_000;
    }

    public baseShield(): number {
        return 200;
    }

    public baseDamage(): number {
        return 1_000;
    }

    public baseSpeed(): number {
         return 10_000;
    }

    public baseCargoCapacity(): number {
        return 1_500;
    }

    public fuelConsumption(): number {
        return 500;
    }
}

export const Battleship = new BattleshipClass();