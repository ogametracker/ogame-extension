import { MoonBuildingLevels } from "./MoonBuildingLevels";
import { MoonShipCount } from "./MoonShipCount";
import { PlanetDataBase } from "./PlanetDataBase";

export interface MoonData extends PlanetDataBase {
    isMoon: true;
    buildings: MoonBuildingLevels;
    ships: MoonShipCount;
}