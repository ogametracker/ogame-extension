import { ShipType } from "../../../ships/ShipType";
import { NonStationaryShipTypes } from "../../../ships/ShipTypes";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { StatsBonus, StatsBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class PlasmaDriveClass extends LifeformTechnology implements StatsBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 7500,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 12500,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 5000,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public appliesTo(ship: ShipType): boolean {
        return (NonStationaryShipTypes as ShipType[])
            .filter(s => s != ShipType.deathStar)
            .includes(ship);
    }

    public getStatsBonus(ship: ShipType, level: number): StatsBonus {
        if (!this.appliesTo(ship)) {
            return { armor: 0, shield: 0, damage: 0, cargo: 0, speed: 0 };
        }

        const armorBonusPerLevel = 0.00_2; //0.2%
        const shieldBonusPerLevel = 0.00_2; //0.2%
        const damageBonusPerLevel = 0.00_2; //0.2%
        const cargoBonusPerLevel = 0.00_2; //0.2%
        const speedBonusPerLevel = 0.00_2; //0.2%
        return {
            armor: armorBonusPerLevel * level,
            shield: shieldBonusPerLevel * level,
            damage: damageBonusPerLevel * level,
            cargo: cargoBonusPerLevel * level,
            speed: speedBonusPerLevel * level,
        };
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.plasmaDrive;
    }
}

export const PlasmaDrive = new PlasmaDriveClass();
