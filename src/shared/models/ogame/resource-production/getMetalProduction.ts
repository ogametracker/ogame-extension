import { BuildingType } from "../buildings/BuildingType";
import { MetalMine } from "../buildings/MetalMine";
import { getLifeformCollectorClassBonus } from "../lifeforms/buildings/getLifeformCollectorClassBonus";
import { ProductionBreakdown, ProductionDependencies } from "./types";
import { getProductionBuildingDependencies } from "./getProductionBuildingDependencies";
import { ResourceType } from "../resources/ResourceType";
import { _throw } from "@/shared/utils/_throw";
import { ResearchType } from "../research/ResearchType";
import { hasCommandStaff } from "../premium/hasCommandStaff";
import { ShipType } from "../ships/ShipType";
import { getItemBonus } from "./getItemBonus";
import { getCrawlerBoost } from "./getCrawlerBoost";
import { getLifeformBuildingProductionBonus } from "../lifeforms/buildings/getLifeformBuildingProductionBonuses";
import { getLifeformTechnologyProductionBonus } from "../lifeforms/buildings/getLifeformTechnologyProductionBonuses";

function getMetalProductionBoost(position: number) {
    switch (position) {
        case 8:
            return 0.35;

        case 7:
        case 9:
            return 0.23;

        case 6:
        case 10:
            return 0.17;
    }

    return 0;
}


export function getMetalProduction(dependencies: ProductionDependencies): ProductionBreakdown {
    const boost = getMetalProductionBoost(dependencies.planet.coordinates.position);
    const baseProduction = 30 * dependencies.serverSettings.speed.economy * (1 + boost);
    const mineLevel = dependencies.planet.buildings[BuildingType.metalMine];
    const mineProduction = MetalMine.getProduction(mineLevel, getProductionBuildingDependencies(dependencies));

    const collectorClassBonus = getLifeformCollectorClassBonus(dependencies.player);

    return new ProductionBreakdown(
        baseProduction,
        mineProduction,
        ResourceType.metal,
        dependencies.player.research[ResearchType.plasmaTechnology],
        dependencies.player.playerClass,
        dependencies.player.allianceClass,
        dependencies.player.officers.geologist,
        hasCommandStaff(dependencies.player.officers),
        getItemBonus(ResourceType.metal, dependencies.planet.activeItems),
        getCrawlerBoost({
            availableCrawlers: dependencies.planet.ships[ShipType.crawler],
            collectorClassBonus: collectorClassBonus,
            crawlerProductionSetting: dependencies.planet.productionSettings[ShipType.crawler],
            hasGeologist: dependencies.player.officers.geologist,
            playerClass: dependencies.player.playerClass,
            levelMetalMine: dependencies.planet.buildings[BuildingType.metalMine],
            levelCrystalMine: dependencies.planet.buildings[BuildingType.crystalMine],
            levelDeuteriumSynthesizer: dependencies.planet.buildings[BuildingType.deuteriumSynthesizer],
            serverSettings: {
                collectorCrawlerProductionFactorBonus: dependencies.serverSettings.playerClasses.collector.crawlers.productionFactorBonus,
                crawlerMaxProductionFactor: dependencies.serverSettings.playerClasses.crawlers.maxProductionFactor,
                crawlerProductionFactorPerUnit: dependencies.serverSettings.playerClasses.crawlers.productionBoostFactorPerUnit,
                geologistActiveCrawlerFactorBonus: dependencies.serverSettings.playerClasses.collector.crawlers.geologistActiveCrawlerFactorBonus,
            },
        }),
        getLifeformBuildingProductionBonus(dependencies.planet).metal,
        getLifeformTechnologyProductionBonus(dependencies.player).metal,
        collectorClassBonus,
        { collectorProductionFactor: dependencies.serverSettings.playerClasses.collector.productionFactorBonus },
    );
}