import { PlayerClass } from "../classes/PlayerClass";
import { getCrawlerProductionFactor } from "./getCrawlerProductionFactor";

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
    const crawlerProductivity = getCrawlerProductionFactor(
        data.playerClass,
        data.serverSettings.collectorCrawlerProductionFactorBonus,
        data.lifeformTechnologies.collectorClassBonus,
        data.lifeformTechnologies.crawlerProductionBonus,
    );

    return Math.ceil(
        data.serverSettings.crawlerMaxProductionFactor
        / (
            data.serverSettings.crawlerProductionFactorPerUnit
            * crawlerProductivity
            * (1 + data.lifeformTechnologies.crawlerProductionBonus)
            * (data.playerClass == PlayerClass.collector ? 1.5 : 1) //overload
        )
    );
}