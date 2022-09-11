import { LifeformDiscoveryEvent } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEvent";
import { HighscoreTypeName } from "@/shared/models/ogame/highscore";
import { LifeformBuildingType } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyType } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";
import { LifeformType, ValidLifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { CombatReport } from "../../models/combat-reports/CombatReport";
import { DebrisFieldReport } from "../../models/debris-field-reports/DebrisFieldReport";
import { ExpeditionEvent } from "../../models/expeditions/ExpeditionEvents";
import { BuildingType, MoonBuildingType, PlanetBuildingType } from "../../models/ogame/buildings/BuildingType";
import { AllianceClass } from "../../models/ogame/classes/AllianceClass";
import { PlayerClass } from "../../models/ogame/classes/PlayerClass";
import { Coordinates } from "../../models/ogame/common/Coordinates";
import { DefenseType } from "../../models/ogame/defenses/DefenseType";
import { ItemHash } from "../../models/ogame/items/ItemHash";
import { ResearchType } from "../../models/ogame/research/ResearchType";
import { ShipType } from "../../models/ogame/ships/ShipType";
import { Settings } from "../../models/settings/Settings";
import { UniverseSpecificSettings } from "../../models/universe-specific-settings/UniverseSpecificSettings";

export interface V2ExportedAccount {
    language: string;
    serverId: number;
    playerId: number;
    playerName: string;

    combatReports: CombatReport[];
    expeditions: ExpeditionEvent[];
    debrisFieldReports: DebrisFieldReport[];
    lifeformDiscoveries?: LifeformDiscoveryEvent[];
    empire: V2ExportedEmpire;
    universeSpecificSettings?: UniverseSpecificSettings;
}

export interface V2ExportedEmpire {
    officers?: V2ExportedPlayerOfficers;

    allianceClass: AllianceClass;
    playerClass: PlayerClass;
    
    research: Record<ResearchType, number>;
    planetOrder?: number[];
    planets: V2ExportedEmpirePlanet[];
    moons: V2ExportedEmpireMoon[];
    
    lifeformExperience?: Record<ValidLifeformType, number>;
}

export interface V2ExportedPlayerOfficers {
    commander: boolean;
    admiral: boolean;
    geologist: boolean;
    engineer: boolean;
    technocrat: boolean;
}

export interface V2ExportedEmpirePlanet {
    id: number;
    name: string;
    coordinates: Coordinates;
    maxTemperature: number;

    buildings: Record<PlanetBuildingType, number>;
    productionSettings: {
        [BuildingType.metalMine]: number;
        [BuildingType.crystalMine]: number;
        [BuildingType.deuteriumSynthesizer]: number;
        [BuildingType.solarPlant]: number;
        [BuildingType.fusionReactor]: number;
        [ShipType.solarSatellite]: number;
        [ShipType.crawler]: number;
    };
    activeItems: Partial<Record<ItemHash, number | 'permanent'>>;
    defenses: Record<Exclude<DefenseType, DefenseType.smallShieldDome | DefenseType.largeShieldDome>, number> & Record<DefenseType.smallShieldDome | DefenseType.largeShieldDome, boolean>;
    ships: Record<ShipType, number>;
    
    activeLifeform?: LifeformType;
    lifeformBuildings?: Record<LifeformBuildingType, number>;
    lifeformTechnologies?: Record<LifeformTechnologyType, number>;
    activeLifeformTechnologies?: LifeformTechnologyType[];
}

export interface V2ExportedEmpireMoon {
    id: number;
    name: string;
    coordinates: Coordinates;

    buildings: Record<MoonBuildingType, number>;
    activeItems: Partial<Record<ItemHash, number | 'permanent'>>;
    defenses: Record<Exclude<DefenseType, DefenseType.smallShieldDome | DefenseType.largeShieldDome>, number> & Record<DefenseType.smallShieldDome | DefenseType.largeShieldDome, boolean>;
    ships: Record<ShipType, number>;
}

export interface V2ExportedServer {
    language: string;
    serverId: number;
    name: string;

    universeHistory?: V2ExportedUniverseHistory;
}

export type V2ExportedUniverseHistoryPlayerStateItem = 'admin' | 'banned' | 'vacation' | 'inactive' | 'inactive-long' | 'outlaw';

export type V2ExportedUniverseHistoryPlayerCompoundState = null | V2ExportedUniverseHistoryPlayerStateItem[] | 'deleted';

export type V2ExportedUniverseHistoryAllianceCompoundState = null | 'deleted';

export interface V2ExportedUniverseHistoryCoordinates {
    galaxy: number;
    system: number;
    position: number;
}

export type V2ExportedUniverseHistoryPlanetMoonState = null | 'deleted';

export interface V2ExportedUniverseHistoryPlayerScore {
    playerId: number;
    date: number;
    type: HighscoreTypeName;
    score: number;
    position: number;
}
export interface V2ExportedUniverseHistoryPlayerState {
    playerId: number;
    date: number;
    state: V2ExportedUniverseHistoryPlayerCompoundState;
}
export interface V2ExportedUniverseHistoryPlayerAlliance {
    playerId: number;
    date: number;
    allianceId: number | null;
}
export interface V2ExportedUniverseHistoryPlayerName {
    playerId: number;
    date: number;
    name: string;
}
export interface V2ExportedUniverseHistoryAllianceScore {
    allianceId: number;
    date: number;
    type: HighscoreTypeName;
    score: number;
    position: number;
}

export interface V2ExportedUniverseHistoryPlanet {
    id: number;
    playerId: number;
}
export interface V2ExportedUniverseHistoryPlanetName {
    planetId: number;
    date: number;
    name: string;
}
export interface V2ExportedUniverseHistoryPlanetState {
    planetId: number;
    date: number;
    state: V2ExportedUniverseHistoryPlanetMoonState;
}
export interface V2ExportedUniverseHistoryPlanetCoordinates {
    planetId: number;
    date: number;
    coordinates: V2ExportedUniverseHistoryCoordinates;
}
export interface V2ExportedUniverseHistoryMoon {
    id: number;
    planetId: number;
    size: number;
}
export interface V2ExportedUniverseHistoryMoonName {
    moonId: number;
    date: number;
    name: string;
}
export interface V2ExportedUniverseHistoryMoonState {
    moonId: number;
    date: number;
    state: V2ExportedUniverseHistoryPlanetMoonState;
}

export interface V2ExportedUniverseHistoryAllianceTag {
    allianceId: number;
    date: number;
    tag: string;
}
export interface V2ExportedUniverseHistoryAllianceName {
    allianceId: number;
    date: number;
    name: string;
}
export interface V2ExportedUniverseHistoryAllianceMembers {
    allianceId: number;
    date: number;
    members: number[];
}
export interface V2ExportedUniverseHistoryAllianceState {
    allianceId: number;
    date: number;
    state: V2ExportedUniverseHistoryAllianceCompoundState;
}

export interface V2ExportedUniverseHistory {
    _lastUpdate: number;

    players: { id: number }[];
    playerNames: V2ExportedUniverseHistoryPlayerName[];
    playerAlliances: V2ExportedUniverseHistoryPlayerAlliance[];
    playerStates: V2ExportedUniverseHistoryPlayerState[];
    playerScores: V2ExportedUniverseHistoryPlayerScore[];

    alliances: { id: number }[];
    allianceTags: V2ExportedUniverseHistoryAllianceTag[];
    allianceNames: V2ExportedUniverseHistoryAllianceName[];
    allianceMembers: V2ExportedUniverseHistoryAllianceMembers[];
    allianceStates: V2ExportedUniverseHistoryAllianceState[];
    allianceScores: V2ExportedUniverseHistoryAllianceScore[];

    planets: V2ExportedUniverseHistoryPlanet[];
    planetNames: V2ExportedUniverseHistoryPlanetName[];
    planetStates: V2ExportedUniverseHistoryPlanetState[];
    planetCoordinates: V2ExportedUniverseHistoryPlanetCoordinates[];

    moons: V2ExportedUniverseHistoryMoon[];
    moonNames: V2ExportedUniverseHistoryMoonName[];
    moonStates: V2ExportedUniverseHistoryMoonState[];
}

export interface V2Export {
    type: 'v2-export';
    settings?: Settings;

    accounts: V2ExportedAccount[];
    servers: V2ExportedServer[];
}