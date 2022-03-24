import { PlanetBuildingLevels } from './PlanetBuildingLevels';
import { PlanetDataBase } from './PlanetDataBase';
import { PlanetShipCount } from './PlanetShipCount';
import { ProductionSettings } from './ProductionSettings';

export interface PlanetData extends PlanetDataBase {
    isMoon: false;
    maxTemperature: number;
    buildings: PlanetBuildingLevels;
    ships: PlanetShipCount;

    productionSettings: ProductionSettings;
}