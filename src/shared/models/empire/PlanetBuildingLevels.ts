import { PlanetBuildingProductionLevels } from './PlanetBuildingProductionLevels';
import { PlanetBuildingFacilitiesLevels } from './PlanetBuildingFacilitiesLevels';

export interface PlanetBuildingLevels {
    production: PlanetBuildingProductionLevels;
    facilities: PlanetBuildingFacilitiesLevels;
}