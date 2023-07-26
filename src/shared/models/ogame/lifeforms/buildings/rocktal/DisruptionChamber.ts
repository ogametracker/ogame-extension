import { Cost } from "../../../common/Cost";
import { ResourceType } from "../../../resources/ResourceType";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { ResourceConsumptionReductionLifeformBuilding, ResourceProductionBonusLifeformBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class DisruptionChamberClass extends LifeformBuilding implements ResourceProductionBonusLifeformBuilding, ResourceConsumptionReductionLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 20_000,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 15_000,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 10_000,
                increaseFactor: 1.2,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 0,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [
            { type: LifeformBonusTypeId.EnergyProductionBonus },
            { type: LifeformBonusTypeId.EnergyConsumptionReduction },
        ];
    }
    
    public get type(): LifeformBuildingType {
        return LifeformBuildingType.disruptionChamber;
    }

    public appliesTo(resource: ResourceType | 'energy'): boolean {
        return resource == 'energy';
    }

    public getConsumptionReduction(level: number): Cost {
        const energyReduction = 0.005; // 0.5%

        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: energyReduction * level,
        };
    }

    public getProductionBonus(level: number): Cost {
        const energyBonus = 0.015; // 1.5%

        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: energyBonus * level,
        };
    }
}

export const DisruptionChamber = new DisruptionChamberClass();