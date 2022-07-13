import { HighscoreType, HighscoreTypeName } from "@/shared/models/ogame/highscore";
import { DBSchema } from "idb";

export type DbUniverseHistoryPlayerStateItem = 'admin' | 'banned' | 'vacation' | 'inactive' | 'inactive-long' | 'outlaw';

export type DbUniverseHistoryPlayerState = null | DbUniverseHistoryPlayerStateItem[] | 'deleted';

export interface DbUniverseHistoryPlayer {
    id: number;
    name: string;
    state: DbUniverseHistoryPlayerState;
    score: {
        total: number;
        economy: number;
        research: number;
        military: number;
        militaryBuilt: number;
        militaryDestroyed: number;
        militaryLost: number;
        honor: number;
        numberOfShips: number;
    };
    scorePosition: {
        total: number;
        economy: number;
        research: number;
        military: number;
        militaryBuilt: number;
        militaryDestroyed: number;
        militaryLost: number;
        honor: number;
        numberOfShips: number;
    };
    allianceId: number | null;
    planetIds: number[];
}

export type DbUniverseHistoryAllianceState = null | 'deleted';

export interface DbUniverseHistoryAlliance {
    id: number;
    tag: string;
    name: string;
    state: DbUniverseHistoryAllianceState;
    memberIds: number[];
}

export interface DbUniverseHistoryCoordinates {
    galaxy: number;
    system: number;
    position: number;
}

export type DbUniverseHistoryPlanetMoonState = null | 'deleted';

export type DbUniverseHistoryScoreType = HighscoreTypeName;

export interface OgameTrackerUniverseHistoryPlayerScore {
    playerId: number;
    date: number;
    type: DbUniverseHistoryScoreType;
    score: number;
    position: number;
}
export interface OgameTrackerUniverseHistoryPlayerState {
    playerId: number;
    date: number;
    state: DbUniverseHistoryPlayerState;
}
export interface OgameTrackerUniverseHistoryPlayerAlliance {
    playerId: number;
    date: number;
    allianceId: number | null;
}
export interface OgameTrackerUniverseHistoryPlayerName {
    playerId: number;
    date: number;
    name: string;
}
export interface OgameTrackerUniverseHistoryAllianceScore {
    allianceId: number;
    date: number;
    type: DbUniverseHistoryScoreType;
    score: number;
    position: number;
}

export interface OgameTrackerUniverseHistoryPlanet {
    id: number;
    playerId: number;
}
export interface OgameTrackerUniverseHistoryPlanetName {
    planetId: number;
    date: number;
    name: string;
}
export interface OgameTrackerUniverseHistoryPlanetState {
    planetId: number;
    date: number;
    state: DbUniverseHistoryPlanetMoonState;
}
export interface OgameTrackerUniverseHistoryPlanetCoordinates {
    planetId: number;
    date: number;
    coordinates: DbUniverseHistoryCoordinates;
}
export interface OgameTrackerUniverseHistoryMoon {
    id: number;
    planetId: number;
    size: number;
}
export interface OgameTrackerUniverseHistoryMoonName {
    moonId: number;
    date: number;
    name: string;
}
export interface OgameTrackerUniverseHistoryMoonState {
    moonId: number;
    date: number;
    state: DbUniverseHistoryPlanetMoonState;
}

export interface OgameTrackerUniverseHistoryAllianceTag {
    allianceId: number;
    date: number;
    tag: string;
}
export interface OgameTrackerUniverseHistoryAllianceName {
    allianceId: number;
    date: number;
    name: string;
}
export interface OgameTrackerUniverseHistoryAllianceMembers {
    allianceId: number;
    date: number;
    members: number[];
}

export interface OgameTrackerUniverseHistoryDbSchema extends DBSchema {
    //TODO: add indexes by id+date to be able to traverse in reverse to get latest data
    _lastUpdate: {
        key: 0;
        value: number;
    };

    players: {
        key: number;
        value: {
            id: number;
        };
    };
    playerNames: {
        /** PlayerId, DateTime */
        key: [number, number];
        value: OgameTrackerUniverseHistoryPlayerName;
        indexes: {
            playerId: number;
        };
    };
    playerAlliances: {
        /** PlayerId, DateTime */
        key: [number, number];
        value: OgameTrackerUniverseHistoryPlayerAlliance;
        indexes: {
            playerId: number;
        };
    };
    playerStates: {
        /** PlayerId, DateTime */
        key: [number, number];
        value: OgameTrackerUniverseHistoryPlayerState;
        indexes: {
            playerId: number;
        };
    };
    playerScores: {
        /** PlayerId, DateTime, ScoreType */
        key: [number, number, DbUniverseHistoryScoreType];
        value: OgameTrackerUniverseHistoryPlayerScore;
        indexes: {
            playerId: number;
        };
    };

    planets: {
        /** PlanetId */
        key: number;
        value: OgameTrackerUniverseHistoryPlanet;
        indexes: {
            playerId: number;
        };
    };
    planetNames: {
        /** PlanetId, DateTime */
        key: [number, number];
        value: OgameTrackerUniverseHistoryPlanetName;
        indexes: {
            planetId: number;
        };
    };
    planetStates: {
        /** PlanetId, DateTime */
        key: [number, number];
        value: OgameTrackerUniverseHistoryPlanetState;
        indexes: {
            planetId: number;
        };
    };
    planetCoordinates: {
        /** PlanetId, DateTime */
        key: [number, number];
        value: OgameTrackerUniverseHistoryPlanetCoordinates;
        indexes: {
            planetId: number;
        };
    };

    moons: {
        /** MoonId */
        key: number;
        value: OgameTrackerUniverseHistoryMoon;
        indexes: {
            planetId: number;
        };
    };
    moonNames: {
        /** MoonId, DateTime */
        key: [number, number];
        value: OgameTrackerUniverseHistoryMoonName;
        indexes: {
            moonId: number;
        };
    };
    moonStates: {
        /** MoonId, DateTime */
        key: [number, number];
        value: OgameTrackerUniverseHistoryMoonState;
        indexes: {
            moonId: number;
        };
    };


    alliances: {
        key: number;
        value: {
            id: number;
        };
    };
    allianceTags: {
        /** AllianceId, DateTime */
        key: [number, number];
        value: OgameTrackerUniverseHistoryAllianceTag;
        indexes: {
            allianceId: number;
        };
    };
    allianceNames: {
        /** AllianceId, DateTime */
        key: [number, number];
        value: OgameTrackerUniverseHistoryAllianceName;
        indexes: {
            allianceId: number;
        };
    };
    allianceMembers: {
        /** AllianceId, DateTime */
        key: [number, number];
        value: OgameTrackerUniverseHistoryAllianceMembers;
        indexes: {
            allianceId: number;
        };
    };
    allianceStates: {
        /** AllianceId, DateTime */
        key: [number, number];
        value: {
            allianceId: number;
            date: number;
            state: DbUniverseHistoryAllianceState;
        };
        indexes: {
            allianceId: number;
        };
    };
    allianceScores: {
        /** AllianceId, DateTime, ScoreType */
        key: [number, number, DbUniverseHistoryScoreType];
        value: OgameTrackerUniverseHistoryAllianceScore;
        indexes: {
            allianceId: number;
        };
    };
}