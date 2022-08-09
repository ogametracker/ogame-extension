import { AmortizationItem } from "../empire/amortization/models";

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

    savedAmortization?: {
        date: number;
        items: AmortizationItem[];
    };
}