import { Cost } from "../common/Cost";
import { Ship } from "./Ship";

class CrawlerClass extends Ship {

    public getCost(): Cost {
        return {
            metal: 2_000,
            crystal: 2_000,
            deuterium: 1_000,
            energy: 0,            
        };
    }

    public baseHull(): number {
         return 4_000;
    }

    public baseShield(): number {
        return 1;
    }

    public baseDamage(): number {
        return 1;
    }

    public baseSpeed(): number {
         return 0;
    }

    public baseCargoCapacity(): number {
        return 0;
    }

    public fuelConsumption(): number {
        return 0;
    }
}

export const Crawler = new CrawlerClass();