import { BuildingType } from "../../../buildings/BuildingType";
import { AnyBuildingCostAndTimeReductionLifeformBuilding, AnyBuildingType, CostAndTimeReduction } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class MineralResearchCentreClass extends LifeformBuilding implements AnyBuildingCostAndTimeReductionLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 250_000,
                increaseFactor: 1.8,
            },
            crystal: {
                baseCost: 20_000,
                increaseFactor: 1.8,
            },
            deuterium: {
                baseCost: 30_000,
                increaseFactor: 1.8,
            },
            energy: {
                baseCost: 10,
                increaseFactor: 1.08,
            },
        });
    }
    
    public getCostAndTimeReduction(building: AnyBuildingType, level: number): CostAndTimeReduction {
        const buildings: AnyBuildingType[] = [
            BuildingType.metalMine,
            BuildingType.crystalMine,
            BuildingType.deuteriumSynthesizer,
        ];
        
        if(!buildings.includes(building)) {
            return { cost: 0, time: 0 };
        }

        const costReduction = 0.005; //0.5%
        return {
            cost: costReduction * level,
            time: 0,
        };
    }
}

export const MineralResearchCentre = new MineralResearchCentreClass();