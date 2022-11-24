import { PlayerClass } from "../classes/PlayerClass";

export interface MaxCrawlerBoostCalculationData {
    playerClass: PlayerClass;
    lifeformTechnologies: {
        collectorClassBonus: number;
        crawlerProductionBonus: number;
    };
    serverSettings: {
        geologistActiveCrawlerFactorBonus: number;
        collectorCrawlerProductionFactorBonus: number;
        crawlerProductionFactorPerUnit: number;
        crawlerMaxProductionFactor: number;
    };
}
export function getCrawlerCountForMaximumBoost(data: MaxCrawlerBoostCalculationData): number {
    const crawlerProductivity = data.playerClass == PlayerClass.collector
        ? (1 + data.serverSettings.collectorCrawlerProductionFactorBonus) * (1 + data.lifeformTechnologies.collectorClassBonus) * 1.5 // overload
        : 1;

    return Math.ceil(
        data.serverSettings.crawlerMaxProductionFactor
        / (
            data.serverSettings.crawlerProductionFactorPerUnit
            * crawlerProductivity
            * (1 + data.lifeformTechnologies.crawlerProductionBonus)
        )
    );
}