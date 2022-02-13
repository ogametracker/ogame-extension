import { Coordinates } from "../../models/v1/ogame/common/Coordinates";

interface BasicPlanetDataBase {
    id: number;
    name: string;
    coordinates: Coordinates;
}

export interface BasicPlanetDataPlanet extends BasicPlanetDataBase {
    isMoon: false;
    maxTemperature: number;
}

export interface BasicPlanetDataMoon extends BasicPlanetDataBase {
    isMoon: true;
}

export type BasicPlanetData = BasicPlanetDataPlanet | BasicPlanetDataMoon;