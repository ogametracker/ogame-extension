import { ServerSettings } from "../../server-settings/ServerSettings";

export function getMaxActiveCrawlers(
    metalMineLevel: number,
    crystalMineLevel: number,
    deuteriumSynthesizerLevel: number,
    isCollector: boolean,
    hasGeologist: boolean,
    serverSettings: ServerSettings,
    collectorClassFactor: number
) {
    const maxCrawlerFactor = hasGeologist && isCollector
        ? (1 + serverSettings.playerClasses.collector.crawlers.geologistActiveCrawlerFactorBonus) * collectorClassFactor
        : 1;
        
    const crawlersPerLevel = 8;
    const maxCrawlers = Math.floor(
        (metalMineLevel + crystalMineLevel + deuteriumSynthesizerLevel) 
        * crawlersPerLevel
        * maxCrawlerFactor
    );

    return maxCrawlers;
}