import { Coordinates } from "../models/ogame/common/Coordinates";
import { PlanetType } from "../models/ogame/common/PlanetType";
import { parseIntSafe } from "./parseNumbers";

const coordsRegex = /^\[(?<galaxy>\d+):(?<system>\d+):(?<position>\d+)\]$/;

export function parseCoordinates(coords: string, type = PlanetType.planet): Coordinates {
    const match = coords.match(coordsRegex)
    if (match == null || match.groups == null) {
        throw new Error(`invalid coordinates '${coords}'`);
    }

    return {
        galaxy: parseIntSafe(match.groups.galaxy, 10),
        system: parseIntSafe(match.groups.system, 10),
        position: parseIntSafe(match.groups.position, 10),
        type,
    };
}