import { Cost } from "../common/Cost";
import { BuildingType } from "./BuildingType";
import { ProductionBuilding, ProductionBuildingDependencies } from "./ProductionBuilding";

class SolarPlantClass extends ProductionBuilding {
    
    public get type() {
        return BuildingType.solarPlant;
    }

    public getProduction(level: number, dependencies: ProductionBuildingDependencies): number {
        //TODO: solar plant production
        throw new Error('not implemented');
    }

    public getConsumption(level: number, dependencies: ProductionBuildingDependencies): Cost {
        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: 0,
        };
    }

    public getCost(level: number): Cost {
        return {
            metal: Math.floor(50 * 1.5 ** level),
            crystal: Math.floor(20 * 1.5 ** level),
            deuterium: 0,
            energy: 0,
        };
    }
}

export const SolarPlant = new SolarPlantClass();
