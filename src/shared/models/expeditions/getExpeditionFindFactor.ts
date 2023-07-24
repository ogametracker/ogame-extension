export function getExpeditionFindFactor(topScore: number): number {
    if (topScore < 100_000) return 0.10;
    if (topScore < 1_000_000) return 0.24;
    if (topScore < 5_000_000) return 0.36;
    if (topScore < 25_000_000) return 0.48;
    if (topScore < 50_000_000) return 0.60;
    if (topScore < 75_000_000) return 0.72;
    if (topScore < 100_000_000) return 0.84;

    return 1.00;
}