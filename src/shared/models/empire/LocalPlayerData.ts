import { AllianceClass } from '../ogame/classes/AllianceClass';
import { PlayerClass } from '../ogame/classes/PlayerClass';
import { MoonData } from './MoonData';
import { PlanetData } from './PlanetData';
import { ResearchLevels } from './ResearchLevels';
import { PlayerOfficers } from './PlayerOfficers';
import { ValidLifeformType } from '../ogame/lifeforms/LifeformType';
import { Fleets } from '../ogame/fleets/types';

export interface LocalPlayerData {
    planets: Record<number, PlanetData | MoonData>;
    planetOrder: number[];
    research: ResearchLevels;
    playerClass: PlayerClass;
    allianceClass: AllianceClass;
    officers: PlayerOfficers;

    lifeformExperience: Record<ValidLifeformType, number>;

    fleets: Fleets;
}