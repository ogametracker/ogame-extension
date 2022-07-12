export enum LifeformType {
    humans = 'humans',
    rocktal = 'rocktal',
    mechas = 'mechas',
    kaelesh = 'kaelesh',
    none = 'none',
}
export type ValidLifeformType = Exclude<LifeformType, LifeformType.none>;

export const ValidLifeformTypes: ValidLifeformType[] = [
    LifeformType.humans,
    LifeformType.rocktal,
    LifeformType.mechas,
    LifeformType.kaelesh,
];

export const LifeformTypes: LifeformType[] = [
    LifeformType.none,
    LifeformType.humans,
    LifeformType.rocktal,
    LifeformType.mechas,
    LifeformType.kaelesh,
];