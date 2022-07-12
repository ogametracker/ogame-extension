export function getLifeformLevel(experience: number) {
    //TODO: get lifeform level
}

export function getExperienceNeededForLevel(level: number) {
    return 5_500 * level * 2 ** (level * 2);
}