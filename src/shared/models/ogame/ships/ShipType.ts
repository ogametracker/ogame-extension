export enum ShipType {
    smallCargo = 202,
    largeCargo = 203,
    lightFighter = 204,
    heavyFighter = 205,
    cruiser = 206,
    battleship = 207,
    colonyShip = 208,
    recycler = 209,
    espionageProbe = 210,
    bomber = 211,
    solarSatellite = 212,
    destroyer = 213,
    deathStar = 214,
    battlecruiser = 215,
    crawler = 217,
    reaper = 218,
    pathfinder = 219,
}
export type StationaryShipType = ShipType.crawler | ShipType.solarSatellite;
export type NonStationaryShipType = Exclude<ShipType, StationaryShipType>;

export type PlanetShipType = ShipType;
export type MoonShipType = Exclude<ShipType, ShipType.crawler>;

export type MilitaryShipType = (
    | ShipType.lightFighter
    | ShipType.heavyFighter
    | ShipType.cruiser
    | ShipType.battleship
    | ShipType.battlecruiser
    | ShipType.bomber
    | ShipType.destroyer
    | ShipType.deathStar
    | ShipType.reaper
    | ShipType.pathfinder
    | ShipType.crawler // yes, it's counted to the military ships
);
export type CivilShipType = (
    | ShipType.smallCargo
    | ShipType.largeCargo
    | ShipType.colonyShip
    | ShipType.recycler
    | ShipType.espionageProbe
    | ShipType.solarSatellite
);