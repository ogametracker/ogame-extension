import { DBSchema } from "idb";
import { CombatReport } from "../models/combat-reports/CombatReport";
import { DebrisFieldReport } from "../models/debris-field-reports/DebrisFieldReport";
import { MoonData } from "../models/empire/MoonData";
import { PlanetData } from "../models/empire/PlanetData";
import { PlanetDataBase } from "../models/empire/PlanetDataBase";
import { PlayerOfficers } from "../models/empire/PlayerOfficers";
import { ResearchLevels } from "../models/empire/ResearchLevels";
import { ExpeditionEvent } from "../models/expeditions/ExpeditionEvents";
import { BuildingType } from "../models/ogame/buildings/BuildingType";
import { AllianceClass } from "../models/ogame/classes/AllianceClass";
import { PlayerClass } from "../models/ogame/classes/PlayerClass";
import { Coordinates } from "../models/ogame/common/Coordinates";
import { DefenseType } from "../models/ogame/defenses/DefenseType";
import { ItemHash } from "../models/ogame/items/ItemHash";
import { ResearchType } from "../models/ogame/research/ResearchType";
import { ShipType } from "../models/ogame/ships/ShipType";
import { Settings } from "../models/settings/Settings";

export interface DbBasicMoonData {
    id: number;
    name: string;
    coordinates: Coordinates;
}

export interface DbBasicPlanetData {
    id: number;
    name: string;
    coordinates: Coordinates;
    maxTemperature: number;
}

export type DbPlanetBuildingLevels = Record<(
    | BuildingType.metalMine
    | BuildingType.crystalMine
    | BuildingType.deuteriumSynthesizer
    | BuildingType.metalStorage
    | BuildingType.crystalStorage
    | BuildingType.deuteriumTank
    | BuildingType.solarPlant
    | BuildingType.fusionReactor

    | BuildingType.roboticsFactory
    | BuildingType.shipyard
    | BuildingType.researchLab
    | BuildingType.allianceDepot
    | BuildingType.missileSilo
    | BuildingType.naniteFactory
    | BuildingType.terraformer
    | BuildingType.spaceDock
), number>;

export type DbMoonBuildingLevels = Record<(
    | BuildingType.metalStorage
    | BuildingType.crystalStorage
    | BuildingType.deuteriumTank

    | BuildingType.roboticsFactory
    | BuildingType.shipyard
    | BuildingType.lunarBase
    | BuildingType.sensorPhalanx
    | BuildingType.jumpGate
), number>;

export type DbActiveItems = Partial<Record<ItemHash, number | 'permanent'>>;
export type DbShipAmounts = Record<ShipType, number>;
export type DbDefenseAmounts = Record<DefenseType, number>;

export type DbPlanetProductionSettings = {
    [BuildingType.metalMine]: number;
    [BuildingType.crystalMine]: number;
    [BuildingType.deuteriumSynthesizer]: number;
    [BuildingType.solarPlant]: number;
    [BuildingType.fusionReactor]: number;
    [ShipType.solarSatellite]: number;
    [ShipType.crawler]: number;
};

export type DbPlayerOfficers = {
    commander: boolean;
    admiral: boolean;
    geologist: boolean;
    engineer: boolean;
    technocrat: boolean;
};
export type DbPlayerResearchLevels = Record<ResearchType, number>;
export type DbPlayerPlanetIds = number[];


export interface OgameTrackerPlayerDbSchema extends DBSchema {
    combatReports: {
        key: number;
        value: CombatReport;
    };

    debrisFieldReports: {
        key: number;
        value: DebrisFieldReport;
    };

    expeditions: {
        key: number;
        value: ExpeditionEvent;
    };

    empire: (
        | { key: 'allianceClass'; value: AllianceClass }
        | { key: 'officers'; value: DbPlayerOfficers }
        | { key: 'playerClass'; value: PlayerClass }
        | { key: 'research'; value: DbPlayerResearchLevels }
        | { key: 'planets'; value: DbPlayerPlanetIds } //TODO: track order of planets & moons

        | { key: `planet.${number}`; value: DbBasicPlanetData }
        | { key: `planet.${number}.buildings`; value: DbPlanetBuildingLevels }
        | { key: `planet.${number}.ships`; value: DbShipAmounts }
        | { key: `planet.${number}.defenses`; value: DbDefenseAmounts }
        | { key: `planet.${number}.activeItems`; value: DbActiveItems }

        | { key: `moon.${number}`; value: DbBasicMoonData }
        | { key: `moon.${number}.ships`; value: DbMoonBuildingLevels }
        | { key: `moon.${number}.defenses`; value: DbDefenseAmounts }
        | { key: `moon.${number}.activeItems`; value: DbActiveItems }
    );
}

export interface OgameTrackerServerDbSchema extends DBSchema {
    //TODO: tables for universe history
    //TODO: table for server settings
}

export interface OgameTrackerGlobalDbSchema extends DBSchema {
    settings: {
        key: 0;
        value: Settings;
    };

    //TODO: table for tracked accounts
    accounts: {
        key: `s${number}-${string}-${number}`;
        value: {
            id: number;
            name?: string;
        };
    };

    //TODO: table for known servers
    servers: {
        key: `s${number}-${string}`,
        value: {
            id: number;
            name: string;
            language: string;
        };
    };
}



export const DbVersion = 1;