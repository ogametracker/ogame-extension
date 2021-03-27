import PlanetType from "./PlanetType";

export default interface Coordinates {
    galaxy: number;
    system: number;
    position: number;
    type: PlanetType;
}