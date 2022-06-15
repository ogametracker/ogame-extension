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

export type DbUniverseHistoryScoreType = 'total' | 'economy' | 'research' | 'military' | 'militaryBuilt' | 'militaryDestroyed' | 'militaryLost' | 'honor' | 'numberOfShips';

export interface OgameTrackerUniverseHistoryPlayerScore {
    playerId: number;
    date: number;
    type: DbUniverseHistoryScoreType;
    score: number;
    position: number;
}

export interface OgameTrackerUniverseHistoryDbSchema extends DBSchema {
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
        value: {
            playerId: number;
            date: number;
            name: string;
        };
        indexes: {
            playerId: number;
        };
    };
    playerAlliances: {
        /** PlayerId, DateTime */
        key: [number, number];
        value: {
            playerId: number;
            date: number;
            allianceId: number | null;
        };
        indexes: {
            playerId: number;
        };
    };
    playerStates: {
        /** PlayerId, DateTime */
        key: [number, number];
        value: {
            playerId: number;
            date: number;
            state: DbUniverseHistoryPlayerState;
        };
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
        value: {
            id: number;
            playerId: number;
        };
        indexes: {
            playerId: number;
        };
    };
    planetNames: {
        /** PlanetId, DateTime */
        key: [number, number];
        value: {
            planetId: number;
            date: number;
            name: string;
        };
        indexes: {
            planetId: number;
        };
    };
    planetStates: {
        /** PlanetId, DateTime */
        key: [number, number];
        value: {
            planetId: number;
            date: number;
            state: DbUniverseHistoryPlanetMoonState;
        };
        indexes: {
            planetId: number;
        };
    };
    planetCoordinates: {
        /** PlanetId, DateTime */
        key: [number, number];
        value: {
            planetId: number;
            date: number;
            coordinates: DbUniverseHistoryCoordinates;
        };
        indexes: {
            planetId: number;
        };
    };

    moons: {
        /** MoonId */
        key: number;
        value: {
            id: number;
            planetId: number;
            size: number;
        };
        indexes: {
            planetId: number;
        };
    };
    moonNames: {
        /** MoonId, DateTime */
        key: [number, number];
        value: {
            moonId: number;
            date: number;
            name: string;
        };
        indexes: {
            moonId: number;
        };
    };
    moonStates: {
        /** MoonId, DateTime */
        key: [number, number];
        value: {
            moonId: number;
            date: number;
            state: DbUniverseHistoryPlanetMoonState;
        };
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
        value: {
            allianceId: number;
            date: number;
            tag: string;
        };
        indexes: {
            allianceId: number;
        };
    };
    allianceNames: {
        /** AllianceId, DateTime */
        key: [number, number];
        value: {
            allianceId: number;
            date: number;
            name: string;
        };
        indexes: {
            allianceId: number;
        };
    };
    allianceMembers: {
        /** AllianceId, DateTime */
        key: [number, number];
        value: {
            allianceId: number;
            date: number;
            members: number[];
        };
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
        value: {
            allianceId: number;
            date: number;
            type: DbUniverseHistoryScoreType;
            score: number;
            position: number;
        };
        indexes: {
            allianceId: number;
        };
    };
}