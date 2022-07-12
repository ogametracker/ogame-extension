export enum LifeformType {
    humans = 'humans',
    rocktal = 'rocktal',
    mechas = 'mechas',
    kaelesh = 'kaelesh',
    none = 'none',
}

/** excludes 'none' */
export const LifeformTypes: LifeformType[] = [
    LifeformType.humans,
    LifeformType.rocktal,
    LifeformType.mechas,
    LifeformType.kaelesh,
];