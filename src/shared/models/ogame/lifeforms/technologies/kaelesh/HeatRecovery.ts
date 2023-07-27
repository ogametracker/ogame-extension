import { ShipType } from "../../../ships/ShipType";
import { NonStationaryShipTypes } from "../../../ships/ShipTypes";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { FuelConsumptionReductionLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class HeatRecoveryClass extends LifeformTechnology implements FuelConsumptionReductionLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 10_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 6_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 1_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [{ type: LifeformBonusTypeId.FuelConsumptionReduction }];
    }
    
    public appliesTo(ship: ShipType): boolean {
        return (NonStationaryShipTypes as ShipType[]).includes(ship);
    }

    public getFuelConsumptionReduction(ship: ShipType, level: number): number {
        if(!this.appliesTo(ship)) {
            return 0;
        }

        const reductionPerLevel = 0.00_03; //0.03%
        const maxReduction = 0.3; //30%
        
        return Math.min(maxReduction, reductionPerLevel * level);
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.heatRecovery;
    }
}

export const HeatRecovery = new HeatRecoveryClass();
