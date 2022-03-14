import PlanetType from "./PlanetType";

export default interface Coordinates {
    galaxy: number;
    system: number;
    position: number;
    type: PlanetType;
}

export function parseCoordinates(coords: string): Coordinates {
    const regex = /\[(?<galaxy>\d+):(?<system>\d+):(?<position>\d+)\]/;
    const match = coords.match(regex);
    if(match == null) {
        throw new Error(`invalid coordinates: '${coords}'`);
    }

    return {
        galaxy: parseInt(match.groups!.galaxy, 10),
        system: parseInt(match.groups!.system, 10),
        position: parseInt(match.groups!.position, 10),
        type: PlanetType.planet,
    };
}