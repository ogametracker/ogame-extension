export const expeditionFindScoreTiers = [
    { minScore: 0, factor: 0.1 },
    { minScore: 100_000, factor: 0.24 },
    { minScore: 1_000_000, factor: 0.36 },
    { minScore: 5_000_000, factor: 0.48 },
    { minScore: 25_000_000, factor: 0.6 },
    { minScore: 50_000_000, factor: 0.72 },
    { minScore: 75_000_000, factor: 0.84 },
    { minScore: 100_000_000, factor: 1 },
] as const;

export function getExpeditionFindFactor(topScore: number): number {
    const nextTier = expeditionFindScoreTiers.findIndex(tier => topScore < tier.minScore);
    return expeditionFindScoreTiers.at(nextTier === -1 ? -1 : Math.max(0, nextTier - 1))!.factor;
}
