import { getLifeformBonusLimit } from './LifeformBonusLimits';
import { LifeformBonusTypeId } from './LifeformBonusType';

export function getTechnologyBonusFactor(buildingBoost: number, levelBoost: number): number {
    return 1 + buildingBoost + levelBoost; // this is the correct formula (checked 2023-02-11)
}

export function getLifeformTechnologyBonusBreakdown(base: number, buildingBoost: number, experienceBoost: number) {
    const buildingBoostLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost });
    const cappedBuildingBoost = Math.min(buildingBoost, buildingBoostLimit ?? Infinity);
    const buildings = base * cappedBuildingBoost;
    const level = base * experienceBoost;
    return { base, buildings, level, total: base * getTechnologyBonusFactor(cappedBuildingBoost, experienceBoost) };
}
