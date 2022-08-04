export enum HighscoreType {
    total = 0,
    economy = 1,
    research = 2,
    militaryAndNumberOfShips = 3,
    militaryLost = 4,
    militaryBuilt = 5,
    militaryDestroyed = 6,
    honor = 7,

    lifeform = 8,
    lifeformEconomy = 9,
    lifeformTechnology = 10,
    lifeformDiscoveries = 11,
}

export type HighscoreTypeName =
    'total' | 'economy' | 'research'
    | 'military' | 'militaryBuilt' | 'militaryDestroyed' | 'militaryLost'
    | 'honor' | 'numberOfShips'
    | 'lifeform' | 'lifeformEconomy' | 'lifeformTechnology' | 'lifeformDiscoveries';

export const HighscoreTypeNames: HighscoreTypeName[] = [
    'total', 'economy', 'research',
    'military', 'militaryBuilt', 'militaryDestroyed', 'militaryLost',
    'honor', 'numberOfShips',
    'lifeform', 'lifeformEconomy', 'lifeformTechnology', 'lifeformDiscoveries'
];