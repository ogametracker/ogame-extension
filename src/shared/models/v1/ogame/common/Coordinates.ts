import { PlanetType } from "./PlanetType";

export interface Coordinates {
    galaxy: number;
    system: number;
    position: number;
    type: PlanetType;
}