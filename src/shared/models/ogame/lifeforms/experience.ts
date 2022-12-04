const bonusPerLevel = 0.00_1; //0.11%

export function getLifeformLevelTechnologyBonus(experience: number): number {
    const level = getLifeformLevel(experience);
    return level * bonusPerLevel;
}

export function getLifeformLevel(experience: number): number {
    for(let level = 0; ; level++) {
        const expForLevel = getLifeformExperienceNeededForLevel(level + 1);
        if(expForLevel > experience) {
            return level;
        }
    }
}

export function getExperienceNeededForLevelUp(level: number): number {
    return 900 * level;
}

export function getLifeformExperienceNeededForLevel(level: number): number {
    return 900 * level * (level + 1) / 2; // gaussian summation formula
}