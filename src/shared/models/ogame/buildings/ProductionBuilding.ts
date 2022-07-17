import { Building } from "./Building";
import { PlanetData } from '../../empire/PlanetData';
import { LocalPlayerData } from '../../empire/LocalPlayerData';
import { Cost } from "../common/Cost";
import { ServerSettings } from "../../server-settings/ServerSettings";

export interface ProductionBuildingDependencies {
    planet: {
        position: number;
        temperature: number;
    };
    economySpeed: number;
    productionSettings: {
        metalMine: number;
        crystalMine: number;
        deuteriumSynthesizer: number;
    };
}

export abstract class ProductionBuilding extends Building {
    public abstract getProduction(level: number, dependencies: ProductionBuildingDependencies): Cost;
    public abstract getConsumption(level: number, dependencies: ProductionBuildingDependencies): Cost;
}