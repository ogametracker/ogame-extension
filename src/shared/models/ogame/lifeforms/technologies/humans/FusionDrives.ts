import { ShipType } from "../../../ships/ShipType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { StatsBonus, StatsBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class FusionDrivesClass extends LifeformTechnology implements StatsBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 15_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 10_000,
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

    public appliesTo(ship: ShipType): boolean {
        return [
            ShipType.smallCargo,
            ShipType.largeCargo,
            ShipType.colonyShip,
            ShipType.recycler,
            ShipType.espionageProbe,
        ].includes(ship);
    }

    public getStatsBonus(ship: ShipType, level: number): StatsBonus {
        if (!this.appliesTo(ship)) {
            return { armor: 0, shield: 0, damage: 0, cargo: 0, speed: 0 };
        }

        const speedBonusPerLevel = 0.00_5; //0.5%
        return {
            armor: 0,
            shield: 0,
            damage: 0,
            cargo: 0,
            speed: speedBonusPerLevel * level,
        };
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.fusionDrives;
    }
}

export const FusionDrives = new FusionDrivesClass();
