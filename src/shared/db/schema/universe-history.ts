import { DBSchema } from "idb";

type DbUniverseHistoryPlayerStateItem = 'admin' | 'banned' | 'vacation' | 'inactive' | 'inactive-long' | 'outlaw';

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
interface DbUniverseHistoryItem<T> {
    date: number;
    value: T;
}

interface DbUniverseHistoryCoordinates {
    galaxy: number;
    system: number;
    position: number;
}

type DbUniverseHistoryPlanetMoonState = null | 'deleted';

type DbUniverseHistoryScoreType = 'total' | 'economy' | 'research' | 'military' | 'militaryBuilt' | 'militaryDestroyed' | 'militaryLost' | 'honor' | 'numberOfShips';

export type OgameTrackerUniverseHistoryDbSchema = DBSchema & {
    //TODO: tables for universe history
    _lastUpdate: {
        key: '0';
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
    };
    playerAlliances: {
        /** PlayerId, DateTime */
        key: [number, number];
        value: {
            playerId: number;
            date: number;
            name: null | number;
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
    };
    playerScores: {
        /** PlayerId, DateTime, ScoreType */
        key: [number, number, DbUniverseHistoryScoreType];
        value: {
            playerId: number;
            date: number;
            type: DbUniverseHistoryScoreType;
            score: number;
            position: number;
        };
    };

    planets: {
        /** PlanetId */
        key: number;
        value: {
            id: number;
            planetId: number;
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
    };
    planetStates: {
        /** PlanetId, DateTime */
        key: [number, number];
        value: {
            planetId: number;
            date: number;
            state: DbUniverseHistoryPlanetMoonState;
        };
    };
    planetCoordinates: {
        /** PlanetId, DateTime */
        key: [number, number];
        value: {
            planetId: number;
            date: number;
            state: DbUniverseHistoryCoordinates;
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
    };
    moonNames: {
        /** MoonId, DateTime */
        key: [number, number];
        value: {
            moonId: number;
            date: number;
            name: string;
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
    };
    allianceNames: {
        /** AllianceId, DateTime */
        key: [number, number];
        value: {
            allianceId: number;
            date: number;
            name: string;
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
    };
    allianceStates: {
        /** AllianceId, DateTime */
        key: [number, number];
        value: {
            allianceId: number;
            date: number;
            state: DbUniverseHistoryAllianceState;
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
    };
}