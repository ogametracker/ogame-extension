import { CombatReport } from "@/shared/models/combat-reports/CombatReport";
import { DebrisFieldReport } from "@/shared/models/debris-field-reports/DebrisFieldReport";
import { ExpeditionEvent } from "@/shared/models/expeditions/ExpeditionEvents";
import { BuildingType, MoonBuildingType, PlanetBuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { AllianceClass } from "@/shared/models/ogame/classes/AllianceClass";
import { PlayerClass } from "@/shared/models/ogame/classes/PlayerClass";
import { Coordinates } from "@/shared/models/ogame/common/Coordinates";
import { DefenseType } from "@/shared/models/ogame/defenses/DefenseType";
import { ItemHash } from "@/shared/models/ogame/items/ItemHash";
import { LifeformBuildingType } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyType } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { ResearchType } from "@/shared/models/ogame/research/ResearchType";
import { ShipType } from "@/shared/models/ogame/ships/ShipType";
import { UniverseSpecificSettings } from "@/shared/models/universe-specific-settings/UniverseSpecificSettings";
import { DBSchema } from "idb";

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

export type DbPlanetBuildingLevels = Record<PlanetBuildingType, number>;

export type DbMoonBuildingLevels = Record<MoonBuildingType, number>;

export type DbActiveItems = Partial<Record<ItemHash, number | 'permanent'>>;

export type DbShipAmounts = Record<ShipType, number>;

export type DbDefenseAmounts = 
    Record<Exclude<DefenseType, DefenseType.smallShieldDome | DefenseType.largeShieldDome>, number>
    & Record<DefenseType.smallShieldDome | DefenseType.largeShieldDome, boolean>;

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


export type DbPlanetSelectedLifeform = LifeformType;
export type DbPlanetLifeformBuildingLevels = Record<LifeformBuildingType, number>;
export type DbPlanetLifeformTechnologyLevels = Record<LifeformTechnologyType, number>;
export type DbPlanetActiveLifeformTechnologies = LifeformTechnologyType[];

type DbEmpire = (
    | { key: 'allianceClass'; value: AllianceClass }
    | { key: 'officers'; value: DbPlayerOfficers }
    | { key: 'playerClass'; value: PlayerClass }
    | { key: 'research'; value: DbPlayerResearchLevels }
    | { key: 'planetOrder'; value: DbPlayerPlanetIds }

    | { key: `planet.${number}`; value: DbBasicPlanetData }
    | { key: `planet.${number}.buildings`; value: DbPlanetBuildingLevels }
    | { key: `planet.${number}.ships`; value: DbShipAmounts }
    | { key: `planet.${number}.defenses`; value: DbDefenseAmounts }
    | { key: `planet.${number}.activeItems`; value: DbActiveItems }
    | { key: `planet.${number}.productionSettings`; value: DbPlanetProductionSettings }
    | { key: `planet.${number}.lifeform`; value: DbPlanetSelectedLifeform }
    | { key: `planet.${number}.lifeformBuildings`; value: DbPlanetLifeformBuildingLevels }
    | { key: `planet.${number}.lifeformTechnologies`; value: DbPlanetLifeformTechnologyLevels }
    | { key: `planet.${number}.activeLifeformTechnologies`; value: DbPlanetActiveLifeformTechnologies }

    | { key: `moon.${number}`; value: DbBasicMoonData }
    | { key: `moon.${number}.buildings`; value: DbMoonBuildingLevels }
    | { key: `moon.${number}.ships`; value: DbShipAmounts }
    | { key: `moon.${number}.defenses`; value: DbDefenseAmounts }
    | { key: `moon.${number}.activeItems`; value: DbActiveItems }
);


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

    empire: DbEmpire;

    universeSpecificSettings: {
        key: 0;
        value: UniverseSpecificSettings;
    };
};