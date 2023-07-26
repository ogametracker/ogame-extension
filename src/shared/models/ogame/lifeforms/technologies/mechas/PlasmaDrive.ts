import { ShipType } from "../../../ships/ShipType";
import { NonStationaryShipTypes, ShipTypes } from "../../../ships/ShipTypes";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { StatsBonus, StatsBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class PlasmaDriveClass extends LifeformTechnology implements StatsBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 7_500,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 12_500,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 5_000,
                increaseFactor: 1.3,
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
        return (NonStationaryShipTypes as ShipType[])
            .filter(s => s != ShipType.deathStar)
            .includes(ship);
    }

    public getStatsBonus(ship: ShipType, level: number): StatsBonus {
        if (!this.appliesTo(ship)) {
            return { armor: 0, shield: 0, damage: 0, cargo: 0, speed: 0 };
        }

        const speedBonusPerLevel = 0.00_2; //0.2%
        return {
            armor: 0,
            shield: 0,
            damage: 0,
            cargo: 0,
            speed: speedBonusPerLevel * level,
        };
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.plasmaDrive;
    }
}

export const PlasmaDrive = new PlasmaDriveClass();
