import { PlayerClass } from "../classes/PlayerClass";

export function getCrawlerProductionFactor(
    playerClass: PlayerClass,
    collectorCrawlerProductionFactorBonus: number,
    collectorClassBonus: number,
    cralwerProductionBonus: number,
): number {
    if (playerClass != PlayerClass.collector) {
        return 1;
    }

    return 1 + (collectorCrawlerProductionFactorBonus * (1 + collectorClassBonus + cralwerProductionBonus));
}