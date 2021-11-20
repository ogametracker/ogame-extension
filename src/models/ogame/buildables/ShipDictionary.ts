import ShipEnum from "@/models/Ship";
import Battlecruiser from "./ships/Battlecruiser";
import Battleship from "./ships/Battleship";
import Bomber from "./ships/Bomber";
import ColonyShip from "./ships/ColonyShip";
import Crawler from "./ships/Crawler";
import Cruiser from "./ships/Cruiser";
import DeathStar from "./ships/DeathStar";
import Destroyer from "./ships/Destroyer";
import EspionageProbe from "./ships/EspionageProbe";
import HeavyFighter from "./ships/HeavyFighter";
import LargeCargo from "./ships/LargeCargo";
import LightFighter from "./ships/LightFighter";
import Pathfinder from "./ships/Pathfinder";
import Reaper from "./ships/Reaper";
import Recycler from "./ships/Recycler";
import Ship from "./ships/Ship";
import SmallCargo from "./ships/SmallCargo";
import SolarSatellite from "./ships/SolarSatellite";

const dictionary: Record<ShipEnum, Ship> = {
    [ShipEnum.lightFighter]: LightFighter,
    [ShipEnum.heavyFighter]: HeavyFighter,
    [ShipEnum.cruiser]: Cruiser,
    [ShipEnum.battleship]: Battleship,
    [ShipEnum.battlecruiser]: Battlecruiser,
    [ShipEnum.bomber]: Bomber,
    [ShipEnum.destroyer]: Destroyer,
    [ShipEnum.deathStar]: DeathStar,
    [ShipEnum.reaper]: Reaper,
    [ShipEnum.pathfinder]: Pathfinder,

    [ShipEnum.smallCargo]: SmallCargo,
    [ShipEnum.largeCargo]: LargeCargo,
    [ShipEnum.colonyShip]: ColonyShip,
    [ShipEnum.recycler]: Recycler,
    [ShipEnum.espionageProbe]: EspionageProbe,
    [ShipEnum.solarSatellite]: SolarSatellite,
    [ShipEnum.crawler]: Crawler,
};
export default dictionary;