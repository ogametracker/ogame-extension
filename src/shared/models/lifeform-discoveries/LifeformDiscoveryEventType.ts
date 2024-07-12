export enum LifeformDiscoveryEventType {
    /** nothing happened */
    nothing = 'nothing',
    /** legacy: discovery probe was lost */
    lostShip = 'lostShip',
    /** dicovered a new (not previously known) lifeform */
    newLifeformFound = 'newLifeformFound',
    /** discovered a known lifeform and gathered some XP */
    knownLifeformFound = 'knownLifeformFound',
    /** artifacts found */
    artifacts = 'artifacts',
}

export const LifeformDiscoveryEventTypes: LifeformDiscoveryEventType[] = [
    LifeformDiscoveryEventType.nothing,
    LifeformDiscoveryEventType.lostShip,
    LifeformDiscoveryEventType.newLifeformFound,
    LifeformDiscoveryEventType.knownLifeformFound,
    LifeformDiscoveryEventType.artifacts,
];