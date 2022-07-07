import { LifeformTechnologyType } from '../ogame/lifeforms/LifeformTechnologyType';
import { LifeformType } from '../ogame/lifeforms/LifeformType';
import { PlanetBuildingLevels } from './PlanetBuildingLevels';
import { PlanetDataBase } from './PlanetDataBase';
import { PlanetLifeformBuildingLevels } from './PlanetLifeformBuildingLevels';
import { PlanetLifeformTechnologyLevels } from './PlanetLifeformTechnologyLevels';
import { PlanetShipCount } from './PlanetShipCount';
import { ProductionSettings } from './ProductionSettings';

export interface PlanetData extends PlanetDataBase {
    isMoon: false;
    maxTemperature: number;
    buildings: PlanetBuildingLevels;
    ships: PlanetShipCount;

    productionSettings: ProductionSettings;
    
    activeLifeform: LifeformType;
    lifeformBuildings: PlanetLifeformBuildingLevels;
    lifeformTechnologies: PlanetLifeformTechnologyLevels;
    activeLifeformTechnologies: LifeformTechnologyType[];
}