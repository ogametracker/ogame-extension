import { Cost } from "../common/Cost";
import { BuildingType } from "./BuildingType";
import { ProductionBuilding, ProductionBuildingDependencies } from "./ProductionBuilding";

class FusionReactorClass extends ProductionBuilding {
    
    public get type() {
        return BuildingType.fusionReactor;
    }

    public getProduction(level: number, dependencies: ProductionBuildingDependencies): number {
        //TODO: fusion reactor production
        throw new Error('not implemented');
    }

    public getConsumption(level: number, dependencies: ProductionBuildingDependencies): Cost {
        return {
            metal: 0,
            crystal: 0,
            deuterium: Math.trunc(10 * level * 1.1 ** level * dependencies.productionSettings.fusionReactor / 100 * dependencies.serverSettings.economySpeed),
            energy: 0,
        };
    }

    public getCost(level: number): Cost {
        return {
            metal: Math.floor(500 * 1.8 ** level),
            crystal: Math.floor(200 * 1.8 ** level),
            deuterium: Math.floor(100 * 1.8 ** level),
            energy: 0,
        };
    }
}

export const FusionReactor = new FusionReactorClass();
