import { LocalPlayerData } from "../../empire/LocalPlayerData";
import { PlanetData } from "../../empire/PlanetData";
import { ServerSettings } from "../../server-settings/ServerSettings";

export interface ProductionBreakdown {
    base: number;
    mine: number;
    crawlers: number;

    plasmaTechnology: number;
    playerClass: number;
    allianceClass: number;
    geologist: number;
    commandStaff: number;
    item: number;

    lifeformBuildings: number;
    lifeformTechnologies: number;

    get total(): number;
}

export interface ProductionDependencies {
    planet: PlanetData;
    player: LocalPlayerData;
    serverSettings: ServerSettings;
}