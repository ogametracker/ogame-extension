import { ShipType } from "../../../ships/ShipType";
import { NonStationaryShipTypes } from "../../../ships/ShipTypes";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { FuelConsumptionReductionLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class EfficiencyModuleClass extends LifeformTechnology implements FuelConsumptionReductionLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 15000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 10000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 5000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
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
        return LifeformTechnologyType.efficiencyModule;
    }
}

export const EfficiencyModule = new EfficiencyModuleClass();
