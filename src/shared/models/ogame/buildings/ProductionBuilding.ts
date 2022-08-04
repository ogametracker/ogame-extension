import { Cost } from "../common/Cost";
import { Building } from "./Building";

export interface ProductionBuildingDependencies {
    planet: {
        position: number;
        temperature: number;
    };
    serverSettings: {
        economySpeed: number;
        crystalBoost: {
            default: number;
            pos1: number;
            pos2: number;
            pos3: number;
        };
    };
    productionSettings: {
        metalMine: number;
        crystalMine: number;
        deuteriumSynthesizer: number;
        fusionReactor: number;
    };
}

export abstract class ProductionBuilding extends Building {
    public abstract getProduction(level: number, dependencies: ProductionBuildingDependencies): number;
    public abstract getConsumption(level: number, dependencies: ProductionBuildingDependencies): Cost;
}