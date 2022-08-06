export enum LifeformDiscoveryEventType {
    /** nothing happened */
    nothing = 'nothing',
    /** discovery probe was los */
    lostShip = 'lostShip',
    /** dicovered a new (not previously known) lifeform */
    newLifeformFound = 'newLifeformFound',
    /** discovered a known lifeform and gathered some XP */
    knownLifeformFound = 'knownLifeformFound',
}