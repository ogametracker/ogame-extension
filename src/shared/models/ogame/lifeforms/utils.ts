export function getTechnologyBonusFactor(buildingBoost: number, levelBoost: number): number {
    return (1 + buildingBoost) * (1 + levelBoost); //TODO: check if this is still correct
}