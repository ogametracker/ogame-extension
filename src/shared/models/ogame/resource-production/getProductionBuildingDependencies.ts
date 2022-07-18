import { BuildingType } from "../buildings/BuildingType";
import { ProductionBuildingDependencies } from "../buildings/ProductionBuilding";
import { ProductionDependencies } from "./types";

export function getProductionBuildingDependencies(dependencies: ProductionDependencies): ProductionBuildingDependencies {
    return {
        serverSettings: {
            economySpeed: dependencies.serverSettings.speed.economy,
            crystalBoost: dependencies.serverSettings.resourceProduction.productionFactorBonus.crystal,
        },
        planet: {
            position: dependencies.planet.coordinates.position,
            temperature: dependencies.planet.maxTemperature,
        },
        productionSettings: {
            metalMine: dependencies.planet.productionSettings[BuildingType.metalMine],
            crystalMine: dependencies.planet.productionSettings[BuildingType.crystalMine],
            deuteriumSynthesizer: dependencies.planet.productionSettings[BuildingType.deuteriumSynthesizer],
            fusionReactor: dependencies.planet.productionSettings[BuildingType.fusionReactor],
        },
    };
}