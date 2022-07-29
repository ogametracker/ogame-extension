import { Cost } from "../common/Cost";
import { BuildingType } from "./BuildingType";
import { ProductionBuilding, ProductionBuildingDependencies } from "./ProductionBuilding";

class DeuteriumSynthesizerClass extends ProductionBuilding {

    public get type() {
        return BuildingType.deuteriumSynthesizer;
    }

    public getProduction(level: number, dependencies: ProductionBuildingDependencies): number {
        const mineProduction = Math.trunc(
            10 
            * level 
            * 1.1 ** level
            * dependencies.serverSettings.economySpeed
            * (1.44 - 0.004 * dependencies.planet.temperature)
            * dependencies.productionSettings.deuteriumSynthesizer / 100
        );
        return mineProduction;
    }

    public getConsumption(level: number, dependencies: ProductionBuildingDependencies): Cost {
        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: Math.ceil(20 * level * 1.1 ** level),
        };
    }

    public getCost(level: number): Cost {
        return {
            metal: Math.round(150 * 1.5 ** level),
            crystal: Math.round(50 * 1.5 ** level),
            deuterium: 0,
            energy: 0,
        };
    }

}
export const DeuteriumSynthesizer = new DeuteriumSynthesizerClass();