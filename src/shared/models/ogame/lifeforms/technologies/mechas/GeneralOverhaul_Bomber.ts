import { ShipType } from "../../../ships/ShipType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { StatsBonus, StatsBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class GeneralOverhaul_BomberClass extends LifeformTechnology implements StatsBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 320000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 240000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 100000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public appliesTo(ship: ShipType): boolean {
        return ship == ShipType.bomber;
    }

    public getStatsBonus(ship: ShipType, level: number): StatsBonus {
        if (!this.appliesTo(ship)) {
            return { armor: 0, shield: 0, damage: 0, cargo: 0, speed: 0 };
        }

        const armorBonusPerLevel = 0.00_3; //0.3%
        const shieldBonusPerLevel = 0.00_3; //0.3%
        const damageBonusPerLevel = 0.00_3; //0.3%
        const cargoBonusPerLevel = 0.00_3; //0.3%
        const speedBonusPerLevel = 0.00_3; //0.3%
        return {
            armor: armorBonusPerLevel * level,
            shield: shieldBonusPerLevel * level,
            damage: damageBonusPerLevel * level,
            cargo: cargoBonusPerLevel * level,
            speed: speedBonusPerLevel * level,
        };
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.generalOverhaul_bomber;
    }
}

export const GeneralOverhaul_Bomber = new GeneralOverhaul_BomberClass();
