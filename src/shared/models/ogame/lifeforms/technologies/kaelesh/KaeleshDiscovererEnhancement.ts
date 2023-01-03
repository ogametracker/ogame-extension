import { PlayerClass } from "../../../classes/PlayerClass";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ClassBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class KaeleshDiscovererEnhancementClass extends LifeformTechnology implements ClassBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 300_000,
                increaseFactor: 1.7,
            },
            crystal: {
                baseCost: 180_000,
                increaseFactor: 1.7,
            },
            deuterium: {
                baseCost: 120_000,
                increaseFactor: 1.7,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public appliesTo(playerClass: PlayerClass): boolean {
        return playerClass == PlayerClass.discoverer;
    }

    public getClassBonus(playerClass: PlayerClass, level: number): number {
        if (!this.appliesTo(playerClass)) {
            return 0;
        }

        const bonus = 0.00_2; // 0.2%
        return bonus * level;
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.kaeleshDiscovererEnhancement;
    }
}

export const KaeleshDiscovererEnhancement = new KaeleshDiscovererEnhancementClass();
