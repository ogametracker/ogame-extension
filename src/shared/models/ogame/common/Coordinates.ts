import { PlanetType } from './PlanetType';

export interface Coordinates {
    galaxy: number;
    system: number;
    position: number;
    type: PlanetType;
}

export function compareCoordinates(a: Coordinates, b: Coordinates): number {
    const keys: (keyof Coordinates)[] = [
        'galaxy',
        'system',
        'position',
        'type',
    ];
    for (const key of keys) {
        const diff = a[key] - b[key];
        if (diff != 0) {
            return diff;
        }
    }
    return 0;
}

export function coordinatesEqual(a: Coordinates, b: Coordinates): boolean {
    return compareCoordinates(a, b) == 0;
}