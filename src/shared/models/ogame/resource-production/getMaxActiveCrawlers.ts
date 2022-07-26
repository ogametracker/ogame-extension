export function getMaxActiveCrawlers(
    metalMineLevel: number,
    crystalMineLevel: number,
    deuteriumSynthesizerLevel: number,
    isCollector: boolean,
    hasGeologist: boolean,
    serverSettings_geologistActiveCrawlerFactorBonus: number,
    collectorClassBonus: number
) {
    const maxCrawlerFactor = hasGeologist && isCollector
        ? (1 + serverSettings_geologistActiveCrawlerFactorBonus) * (1 + collectorClassBonus)
        : 1;

    const crawlersPerLevel = 8;
    const maxCrawlers = Math.floor(
        (metalMineLevel + crystalMineLevel + deuteriumSynthesizerLevel)
        * crawlersPerLevel
        * maxCrawlerFactor
    );

    return maxCrawlers;
}