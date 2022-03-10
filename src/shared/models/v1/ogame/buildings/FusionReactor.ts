import { Cost } from "../common/Cost";
import { ResearchType } from "../research/ResearchType";
import { BuildingType } from "./BuildingType";
import { ProductionBuilding, ProductionBuildingDependencies } from "./ProductionBuilding";

class FusionReactorClass extends ProductionBuilding {

    public getProduction(level: number, dependencies: ProductionBuildingDependencies): Cost {
        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: Math.round(
                Math.floor(30 * level * (1.05 + dependencies.player.research[ResearchType.energyTechnology]* 0.01)** level)
                * (dependencies.planet.productionSettings[BuildingType.fusionReactor] / 100),
                //TODO: production needs to respect items, player class, alliance class, active officers
            ),
        };
    }

    public getConsumption(level: number, dependencies: ProductionBuildingDependencies): Cost {
        return {
            metal: 0,
            crystal: 0,
            deuterium: Math.ceil(10 * level * 1.1 ** level * dependencies.planet.productionSettings[BuildingType.fusionReactor] / 100) * dependencies.economySpeed,
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
