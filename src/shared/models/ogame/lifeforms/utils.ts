export function getTechnologyBonusFactor(buildingBoost: number, levelBoost: number): number {
    return (1 + buildingBoost + levelBoost); // this is the correct formula (checked 2023-02-11)
}