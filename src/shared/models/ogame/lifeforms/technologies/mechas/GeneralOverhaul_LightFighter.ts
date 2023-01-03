import { ShipType } from "../../../ships/ShipType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { StatsBonus, StatsBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class GeneralOverhaul_LightFighterClass extends LifeformTechnology implements StatsBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 160_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 120_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 50_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public appliesTo(ship: ShipType): boolean {
        return ship == ShipType.lightFighter;
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
        return LifeformTechnologyType.generalOverhaul_lightFighter;
    }
}

export const GeneralOverhaul_LightFighter = new GeneralOverhaul_LightFighterClass();
