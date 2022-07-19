import { BuildingType } from "../../../buildings/BuildingType";
import { CostAndTimeReduction } from "../../common-interfaces";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { AnyBuildingCostAndTimeReductionLifeformBuilding, AnyBuildingType } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class MineralResearchCentreClass extends LifeformBuilding implements AnyBuildingCostAndTimeReductionLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 250_000,
                increaseFactor: 1.8,
            },
            crystal: {
                baseCost: 150_000,
                increaseFactor: 1.8,
            },
            deuterium: {
                baseCost: 100_000,
                increaseFactor: 1.8,
            },
            energy: {
                baseCost: 10,
                increaseFactor: 1.08,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.mineralResearchCentre;
    }

    public getCostAndTimeReduction(building: AnyBuildingType, level: number): CostAndTimeReduction {
        if (!this.appliesTo(building)) {
            return { cost: 0, time: 0 };
        }

        const costReduction = 0.005; //0.5%
        return {
            cost: costReduction * level,
            time: 0,
        };
    }

    public appliesTo(building: AnyBuildingType): boolean {
        const buildings: AnyBuildingType[] = [
            BuildingType.metalMine,
            BuildingType.crystalMine,
            BuildingType.deuteriumSynthesizer,
        ];

        return buildings.includes(building);
    }
}

export const MineralResearchCentre = new MineralResearchCentreClass();