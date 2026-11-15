import { PlayerClass } from '../ogame/classes/PlayerClass';
import type { Cost } from '../ogame/common/Cost';
import { getExpeditionFindFactor } from './getExpeditionFindFactor';

export function getDiscovererExpeditionFactor(serverBonus: number, lifeformClassBonus: number): number {
    return (1 + serverBonus) * (1 + lifeformClassBonus);
}

export function getExpeditionShipUnits(cost: Pick<Cost, 'metal' | 'crystal'>): number {
    return cost.metal + cost.crystal;
}

export function getExpeditionFindFactors(options: {
    topScore: number;
    playerClass: PlayerClass;
    economySpeed: number;
    discovererExpeditionBonus: number;
    lifeformDiscovererBonus: number;
}) {
    let classFactor = 1;
    if (options.playerClass === PlayerClass.discoverer) {
        classFactor = getDiscovererExpeditionFactor(options.discovererExpeditionBonus, options.lifeformDiscovererBonus);
    }

    return {
        scoreFactor: getExpeditionFindFactor(options.topScore),
        classFactor,
        economyFactor: options.economySpeed,
    };
}

export function getExpeditionFindAmounts(
    baseAmount: number,
    factors: ReturnType<typeof getExpeditionFindFactors>,
    bonuses: { resources: number; fleet: number; item: number },
) {
    const pathfinderFactor = 2;
    const scaledAmount = factors.scoreFactor * baseAmount * pathfinderFactor * factors.classFactor * factors.economyFactor;
    const metal = scaledAmount * (1 + bonuses.resources) * (1 + bonuses.item);
    return {
        metal,
        crystal: metal / 2,
        deuterium: metal / 3,
        shipUnits: (scaledAmount * (1 + bonuses.fleet)) / 2,
    };
}
