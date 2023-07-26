import { ShipType } from "../../../ships/ShipType";
import { ShipTypes } from "../../../ships/ShipTypes";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { StatsBonus, StatsBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class Overclocking_LargeCargoClass extends LifeformTechnology implements StatsBonusLifeformTechnology {
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

    public get bonuses(): LifeformBonusType[] {
        return ShipTypes.filter(ship => this.appliesTo(ship))
            .map<LifeformBonusType>(ship => ({
                type: LifeformBonusTypeId.StatsBonus,
                tech: ship,
            }));
    }

    public appliesTo(ship: ShipType): boolean {
        return ship == ShipType.largeCargo;
    }

    public getStatsBonus(ship: ShipType, level: number): StatsBonus {
        if (!this.appliesTo(ship)) {
            return { armor: 0, shield: 0, damage: 0, cargo: 0, speed: 0 };
        }

        const armorBonusPerLevel = 0.01; //1%
        const shieldBonusPerLevel = 0.01; //1%
        const damageBonusPerLevel = 0.01; //1%
        const cargoBonusPerLevel = 0.01; //1%
        const speedBonusPerLevel = 0.01; //1%
        return {
            armor: armorBonusPerLevel * level,
            shield: shieldBonusPerLevel * level,
            damage: damageBonusPerLevel * level,
            cargo: cargoBonusPerLevel * level,
            speed: speedBonusPerLevel * level,
        };
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.overclocking_largeCargo;
    }
}

export const Overclocking_LargeCargo = new Overclocking_LargeCargoClass();
