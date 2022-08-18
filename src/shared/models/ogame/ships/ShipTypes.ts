import { Battlecruiser } from "./Battlecruiser";
import { Battleship } from "./Battleship";
import { Bomber } from "./Bomber";
import { ColonyShip } from "./ColonyShip";
import { Crawler } from "./Crawler";
import { Cruiser } from "./Cruiser";
import { DeathStar } from "./DeathStar";
import { Destroyer } from "./Destroyer";
import { EspionageProbe } from "./EspionageProbe";
import { HeavyFighter } from "./HeavyFighter";
import { LargeCargo } from "./LargeCargo";
import { LightFighter } from "./LightFighter";
import { Pathfinder } from "./Pathfinder";
import { Reaper } from "./Reaper";
import { Recycler } from "./Recycler";
import { Ship } from "./Ship";
import { MoonShipType, NonStationaryShipType, PlanetShipType, ShipType, StationaryShipType } from "./ShipType";
import { SmallCargo } from "./SmallCargo";
import { SolarSatellite } from "./SolarSatellite";

export const ShipTypes: ShipType[] = [
    ShipType.smallCargo,
    ShipType.largeCargo,
    ShipType.lightFighter,
    ShipType.heavyFighter,
    ShipType.cruiser,
    ShipType.battleship,
    ShipType.colonyShip,
    ShipType.recycler,
    ShipType.espionageProbe,
    ShipType.bomber,
    ShipType.solarSatellite,
    ShipType.destroyer,
    ShipType.deathStar,
    ShipType.battlecruiser,
    ShipType.crawler,
    ShipType.reaper,
    ShipType.pathfinder,
];
export const StationaryShipTypes: StationaryShipType[] = [
    ShipType.solarSatellite,
    ShipType.crawler,
];
export const NonStationaryShipTypes: NonStationaryShipType[] = [
    ShipType.smallCargo,
    ShipType.largeCargo,
    ShipType.lightFighter,
    ShipType.heavyFighter,
    ShipType.cruiser,
    ShipType.battleship,
    ShipType.colonyShip,
    ShipType.recycler,
    ShipType.espionageProbe,
    ShipType.bomber,
    ShipType.destroyer,
    ShipType.deathStar,
    ShipType.battlecruiser,
    ShipType.reaper,
    ShipType.pathfinder,
];


export const PlanetShipTypes: PlanetShipType[] = [
    ShipType.smallCargo,
    ShipType.largeCargo,
    ShipType.lightFighter,
    ShipType.heavyFighter,
    ShipType.cruiser,
    ShipType.battleship,
    ShipType.colonyShip,
    ShipType.recycler,
    ShipType.espionageProbe,
    ShipType.bomber,
    ShipType.solarSatellite,
    ShipType.destroyer,
    ShipType.deathStar,
    ShipType.battlecruiser,
    ShipType.crawler,
    ShipType.reaper,
    ShipType.pathfinder,
];
export const MoonShipTypes: MoonShipType[] = [
    ShipType.smallCargo,
    ShipType.largeCargo,
    ShipType.lightFighter,
    ShipType.heavyFighter,
    ShipType.cruiser,
    ShipType.battleship,
    ShipType.colonyShip,
    ShipType.recycler,
    ShipType.espionageProbe,
    ShipType.bomber,
    ShipType.solarSatellite,
    ShipType.destroyer,
    ShipType.deathStar,
    ShipType.battlecruiser,
    ShipType.reaper,
    ShipType.pathfinder,
];

export const ShipByTypes: Record<ShipType, Ship> = {
   [ShipType.smallCargo]: SmallCargo,
   [ShipType.largeCargo]: LargeCargo,
   [ShipType.lightFighter]: LightFighter,
   [ShipType.heavyFighter]: HeavyFighter,
   [ShipType.cruiser]: Cruiser,
   [ShipType.battleship]: Battleship,
   [ShipType.colonyShip]: ColonyShip,
   [ShipType.recycler]: Recycler,
   [ShipType.espionageProbe]: EspionageProbe,
   [ShipType.bomber]: Bomber,
   [ShipType.solarSatellite]: SolarSatellite,
   [ShipType.destroyer]: Destroyer,
   [ShipType.deathStar]: DeathStar,
   [ShipType.battlecruiser]: Battlecruiser,
   [ShipType.crawler]: Crawler,
   [ShipType.reaper]: Reaper,
   [ShipType.pathfinder]: Pathfinder,
};