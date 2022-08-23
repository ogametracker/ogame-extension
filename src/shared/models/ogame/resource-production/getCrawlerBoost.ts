import { CrawlerProductionPercentage } from "../../empire/CrawlerProductionPercentage";
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
    lifeformTechnologies: {
        collectorClassBonus: number;
        crawlerProductionBonus: number;
    },
    serverSettings: {
        geologistActiveCrawlerFactorBonus: number;
        collectorCrawlerProductionFactorBonus: number;
        crawlerProductionFactorPerUnit: number;
        crawlerMaxProductionFactor: number;
    };
}

export function getCrawlerBoost(data: CrawlerBoostCalculationData): number {
    const maxCrawlers = getMaxActiveCrawlers(
        data.levelMetalMine,
        data.levelCrystalMine,
        data.levelDeuteriumSynthesizer,
        data.playerClass == PlayerClass.collector,
        data.hasGeologist,
        data.serverSettings.geologistActiveCrawlerFactorBonus,
        data.lifeformTechnologies.collectorClassBonus,
    );
    const crawlerCount = Math.min(maxCrawlers, data.availableCrawlers);
    const crawlerProductivity = data.playerClass == PlayerClass.collector
        ? (1 + data.serverSettings.collectorCrawlerProductionFactorBonus) * (1 + data.lifeformTechnologies.collectorClassBonus)
        : 1;

    const potentialCrawlerBoost =
        data.serverSettings.crawlerProductionFactorPerUnit
        * crawlerCount
        * crawlerProductivity
        * (1 + data.lifeformTechnologies.crawlerProductionBonus)
        * data.crawlerProductionSetting / 100;

    return Math.min(potentialCrawlerBoost, data.serverSettings.crawlerMaxProductionFactor);
}