import { AllianceClass } from "../ogame/classes/AllianceClass";
import { PlayerClass } from "../ogame/classes/PlayerClass";
import { MoonData } from "./MoonData";
import { PlanetData } from "./PlanetData";
import { ResearchLevels } from "./ResearchLevels";
import { PlayerOfficers } from "./PlayerOfficers";

export interface LocalPlayerData {
    planets: Record<number, PlanetData | MoonData>;
    research: ResearchLevels;
    playerClass: PlayerClass;
    allianceClass: AllianceClass;
    officers: PlayerOfficers;
    name?: string;
    universeName?: string;
}