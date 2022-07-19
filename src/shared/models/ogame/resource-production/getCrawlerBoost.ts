import { CrawlerProductionPercentage } from "../../empire/CrawlerProductionPercentage";
import { ServerSettings } from "../../server-settings/ServerSettings";
import { PlayerClass } from "../classes/PlayerClass";
import { getMaxActiveCrawlers } from "./getMaxActiveCrawlers";

export interface CrawlerBoostCalculationData {
    availableCrawlers: number;
    crawlerProductionSetting: CrawlerProductionPercentage;
    levelMetalMine: number;
    levelCrystalMine: number;
    levelDeuteriumSynthesizer: number;
    playerClass: PlayerClass;
    hasGeologist: boolean;
    collectorClassBonus: number;
    serverSettings: ServerSettings;
}

export function getCrawlerBoost(data: CrawlerBoostCalculationData): number {
    const maxCrawlers = getMaxActiveCrawlers(
        data.levelMetalMine,
        data.levelCrystalMine,
        data.levelDeuteriumSynthesizer,
        data.playerClass == PlayerClass.collector,
        data.hasGeologist,
        data.serverSettings,
        data.collectorClassBonus,
    );
    const crawlerCount = Math.min(maxCrawlers, data.availableCrawlers);
    const crawlerProductivity = data.playerClass == PlayerClass.collector
        ? (1 + data.serverSettings.playerClasses.collector.crawlers.productionFactorBonus) * (1 + data.collectorClassBonus)
        : 1;

    const potentialCrawlerBoost =
        data.serverSettings.playerClasses.crawlers.productionBoostFactorPerUnit
        * crawlerCount
        * crawlerProductivity
        * data.crawlerProductionSetting / 100;

    return Math.min(potentialCrawlerBoost, data.serverSettings.playerClasses.crawlers.maxProductionFactor);
}