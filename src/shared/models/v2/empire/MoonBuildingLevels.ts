import { MoonBuildingFacilitiesLevels } from "./MoonBuildingFacilitiesLevels";
import { MoonBuildingProductionLevels } from "./MoonBuildingProductionLevels";

export interface MoonBuildingLevels {
    production: MoonBuildingProductionLevels;
    facilities: MoonBuildingFacilitiesLevels;
}