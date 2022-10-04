const bonusPerLevel = 0.01; //1%

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

export function getLifeformExperienceNeededForLevel(level: number): number {
    return 5_500 * level * 2 ** (level * 2) + 1;
}