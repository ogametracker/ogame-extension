export enum PlayerClass {
    collector = 'collector',
    discoverer = 'discoverer',
    general = 'general',
    none = 'none',
}

export const PlayerClasses: PlayerClass[] = [
    PlayerClass.collector,
    PlayerClass.discoverer,
    PlayerClass.general,
    PlayerClass.none,
];
export const SelectablePlayerClasses: PlayerClass[] = [
    PlayerClass.collector,
    PlayerClass.discoverer,
    PlayerClass.general,
];