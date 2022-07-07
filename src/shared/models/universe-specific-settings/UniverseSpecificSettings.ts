export interface UniverseSpecificSettings {
    universeHistory: {
        players: {
            highscore: number[];
            history?: number;
        };
        alliances: {
            highscore: number[];
            history?: number;
        };
    };
}