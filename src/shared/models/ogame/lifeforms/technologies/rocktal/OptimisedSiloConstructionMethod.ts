import { DefenseType } from "../../../defenses/DefenseType";
import { DefenseTypes } from "../../../defenses/DefenseTypes";
import { ShipType } from "../../../ships/ShipType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { StatsBonus, StatsBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class OptimisedSiloConstructionMethodClass extends LifeformTechnology implements StatsBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 220000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 110000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 110000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public appliesTo(defense: DefenseType): boolean {
        return DefenseTypes.includes(defense);
    }

    public getStatsBonus(defense: DefenseType, level: number): StatsBonus {
        if (!this.appliesTo(defense)) {
            return { armor: 0, shield: 0, damage: 0, cargo: 0, speed: 0 };
        }

        const armorBonusPerLevel = 0.00_5; //0.5%
        const shieldBonusPerLevel = 0.00_5; //0.5%
        const damageBonusPerLevel = 0.00_5; //0.5%
        const cargoBonusPerLevel = 0.00_5; //0.5%
        const speedBonusPerLevel = 0.00_5; //0.5%
        return {
            armor: armorBonusPerLevel * level,
            shield: shieldBonusPerLevel * level,
            damage: damageBonusPerLevel * level,
            cargo: cargoBonusPerLevel * level,
            speed: speedBonusPerLevel * level,
        };
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.optimisedSiloConstructionMethod;
    }
}

export const OptimisedSiloConstructionMethod = new OptimisedSiloConstructionMethodClass();
