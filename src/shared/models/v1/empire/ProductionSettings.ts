import { BuildingType } from "../ogame/buildings/BuildingType";
import { ShipType } from "../ogame/ships/ShipType";
import { ProductionPercentage } from "./ProductionPercentage";
import { CrawlerProductionPercentage } from "./CrawlerProductionPercentage";

export interface ProductionSettings {
    [BuildingType.metalMine]: ProductionPercentage;
    [BuildingType.crystalMine]: ProductionPercentage;
    [BuildingType.deuteriumSynthesizer]: ProductionPercentage;
    [BuildingType.solarPlant]: ProductionPercentage;
    [BuildingType.fusionReactor]: ProductionPercentage;
    [ShipType.solarSatellite]: ProductionPercentage;
    [ShipType.crawler]: CrawlerProductionPercentage;
}