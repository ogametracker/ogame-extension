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
import { ShipType } from "./ShipType";
import { SmallCargo } from "./SmallCargo";
import { SolarSatellite } from "./SolarSatellite";

export const Ships: Record<ShipType, Ship> = {
    [ShipType.lightFighter]: LightFighter,
    [ShipType.heavyFighter]: HeavyFighter,
    [ShipType.cruiser]: Cruiser,
    [ShipType.battleship]: Battleship,
    [ShipType.battlecruiser]: Battlecruiser,
    [ShipType.bomber]: Bomber,
    [ShipType.destroyer]: Destroyer,
    [ShipType.deathStar]: DeathStar,
    [ShipType.reaper]: Reaper,
    [ShipType.pathfinder]: Pathfinder,

    [ShipType.smallCargo]: SmallCargo,
    [ShipType.largeCargo]: LargeCargo,
    [ShipType.colonyShip]: ColonyShip,
    [ShipType.recycler]: Recycler,
    [ShipType.espionageProbe]: EspionageProbe,
    [ShipType.solarSatellite]: SolarSatellite,
    [ShipType.crawler]: Crawler,
};