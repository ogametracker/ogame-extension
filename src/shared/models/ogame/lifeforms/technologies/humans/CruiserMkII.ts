import { ShipType } from "../../../ships/ShipType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ShipStatsBonus, ShipStatsBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class CruiserMkIIClass extends LifeformTechnology implements ShipStatsBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 320_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 240_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 100_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public appliesTo(ship: ShipType): boolean {
        return ship == ShipType.cruiser;
    }

    public getShipStatsBonus(ship: ShipType, level: number): ShipStatsBonus {
        if (!this.appliesTo(ship)) {
            return { armor: 0, shield: 0, damage: 0, cargo: 0, speed: 0 };
        }

        const armorBonusPerLevel = 0.00_3; //0.5%
        const shieldBonusPerLevel = 0.00_3; //0.5%
        const damageBonusPerLevel = 0.00_3; //0.5%
        const cargoBonusPerLevel = 0.00_3; //0.5%
        const speedBonusPerLevel = 0.00_3; //0.5%
        return {
            armor: armorBonusPerLevel * level,
            shield: shieldBonusPerLevel * level,
            damage: damageBonusPerLevel * level,
            cargo: cargoBonusPerLevel * level,
            speed: speedBonusPerLevel * level,
        };
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.cruiserMkII;
    }
}

export const CruiserMkII = new CruiserMkIIClass();
