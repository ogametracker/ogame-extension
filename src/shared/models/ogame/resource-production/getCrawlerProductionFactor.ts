import { PlayerClass } from "../classes/PlayerClass";

export function getCrawlerProductionFactor(
    playerClass: PlayerClass,
    collectorCrawlerProductionFactorBonus: number,
    collectorClassBonus: number,
    crawlerProductionBonus: number,
): number {
    if (playerClass != PlayerClass.collector) {
        return 1;
    }

    return 1 * (1 + crawlerProductionBonus)
        + (collectorCrawlerProductionFactorBonus * (1 + collectorClassBonus));
}