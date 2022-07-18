import { BuildingType } from "../buildings/BuildingType";
import { PlayerClass } from "../classes/PlayerClass";
import { ShipType } from "../ships/ShipType";
import { getMaxActiveCrawlers } from "./getMaxActiveCrawlers";
import { ProductionDependencies } from "./types";

export function getCrawlerBoost(dependencies: ProductionDependencies, collectorClassFactor: number): number {
    const maxCrawlers = getMaxActiveCrawlers(
        dependencies.planet.buildings[BuildingType.metalMine],
        dependencies.planet.buildings[BuildingType.crystalMine],
        dependencies.planet.buildings[BuildingType.deuteriumSynthesizer],
        dependencies.player.playerClass == PlayerClass.collector,
        dependencies.player.officers.geologist,
        dependencies.serverSettings,
        collectorClassFactor,
    );
    const crawlerCount = Math.min(maxCrawlers, dependencies.planet.ships[ShipType.crawler]);
    const crawlerProductivity = dependencies.player.playerClass == PlayerClass.collector
        ? (1 + dependencies.serverSettings.playerClasses.collector.crawlers.productionFactorBonus) * collectorClassFactor
        : 1;

    const potentialCrawlerBoost =
        dependencies.serverSettings.playerClasses.crawlers.productionBoostFactorPerUnit
        * crawlerCount
        * crawlerProductivity
        * dependencies.planet.productionSettings[ShipType.crawler] / 100;

    return Math.min(potentialCrawlerBoost, dependencies.serverSettings.playerClasses.crawlers.maxProductionFactor);
}