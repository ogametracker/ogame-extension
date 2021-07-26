import { LocalPlayerData, MoonData, PlanetData } from "@/store/modules/LocalPlayerModule";
import Cost from "../Cost";
import Building from "./Building";

export interface ProductionInject {
    player: LocalPlayerData;
    currentPlanet: PlanetData;
    ecoSpeed: number;
}

export default abstract class ProductionBuilding extends Building {
    public abstract getProduction(level: number, data: ProductionInject): Cost;
    public abstract getConsumption(level: number, data: ProductionInject): Cost;
}