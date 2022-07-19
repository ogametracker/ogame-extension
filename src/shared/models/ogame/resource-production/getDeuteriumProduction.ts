import { BuildingType } from "../buildings/BuildingType";
import { getLifeformCollectorClassBonus } from "../lifeforms/buildings/getLifeformCollectorClassBonus";
import { ProductionBreakdown, ProductionDependencies } from "./types";
import { getProductionBuildingDependencies } from "./getProductionBuildingDependencies";
import { DeuteriumSynthesizer } from "../buildings/DeuteriumSynthesizer";
import { ResourceType } from "../resources/ResourceType";
import { ResearchType } from "../research/ResearchType";
import { hasCommandStaff } from "../premium/hasCommandStaff";
import { getItemBonus } from "./getItemBonus";
import { getCrawlerBoost } from "./getCrawlerBoost";
import { ShipType } from "../ships/ShipType";
import { getLifeformBuildingProductionBonus } from "../lifeforms/buildings/getLifeformBuildingProductionBonuses";
import { getLifeformTechnologyProductionBonus } from "../lifeforms/buildings/getLifeformTechnologyProductionBonuses";


export function getDeuteriumProduction(dependencies: ProductionDependencies): ProductionBreakdown {
    const mineLevel = dependencies.planet.buildings[BuildingType.deuteriumSynthesizer];
    const mineProduction = DeuteriumSynthesizer.getProduction(mineLevel, getProductionBuildingDependencies(dependencies));
    const collectorClassBonus = getLifeformCollectorClassBonus(dependencies.player);

    return new ProductionBreakdown(
        0,
        mineProduction,
        ResourceType.deuterium,
        dependencies.player.research[ResearchType.plasmaTechnology],
        dependencies.player.playerClass,
        dependencies.player.allianceClass,
        dependencies.player.officers.geologist,
        hasCommandStaff(dependencies.player.officers),
        getItemBonus(ResourceType.deuterium, dependencies.planet.activeItems),
        getCrawlerBoost({
            availableCrawlers: dependencies.planet.ships[ShipType.crawler],
            collectorClassBonus: collectorClassBonus,
            crawlerProductionSetting: dependencies.planet.productionSettings[ShipType.crawler],
            hasGeologist: dependencies.player.officers.geologist,
            playerClass: dependencies.player.playerClass,
            levelMetalMine: dependencies.planet.buildings[BuildingType.metalMine],
            levelCrystalMine: dependencies.planet.buildings[BuildingType.crystalMine],
            levelDeuteriumSynthesizer: dependencies.planet.buildings[BuildingType.deuteriumSynthesizer],
            serverSettings: dependencies.serverSettings,
        }), 
        getLifeformBuildingProductionBonus(dependencies.planet).deuterium,
        getLifeformTechnologyProductionBonus(dependencies.player).deuterium,
        collectorClassBonus,
        { collectorProductionFactor: dependencies.serverSettings.playerClasses.collector.productionFactorBonus },
    );

}