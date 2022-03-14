import { Building } from "./Building";
import { PlanetData } from '../../empire/PlanetData';
import { LocalPlayerData } from '../../empire/LocalPlayerData';
import { Cost } from "../common/Cost";

export interface ProductionBuildingDependencies {
    economySpeed: number;
    planet: PlanetData;
    player: LocalPlayerData;
}

export abstract class ProductionBuilding extends Building {
    public abstract getProduction(level: number, dependencies: ProductionBuildingDependencies): Cost;
    public abstract getConsumption(level: number, dependencies: ProductionBuildingDependencies): Cost;
}