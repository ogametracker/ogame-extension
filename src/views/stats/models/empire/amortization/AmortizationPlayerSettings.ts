import { AllianceClass } from "@/shared/models/ogame/classes/AllianceClass";
import { PlayerClass } from "@/shared/models/ogame/classes/PlayerClass";

export interface AmortizationPlayerSettings {
    msuConversionRates: {
        crystal: number;
        deuterium: number;
    };
    officers: {
        admiral: boolean;
        commander: boolean;
        engineer: boolean;
        geologist: boolean;
        technocrat: boolean;
    };
    playerClass: PlayerClass;
    allianceClass: AllianceClass;
    levelPlasmaTechnology: number;
    levelAstrophysics: number;
    numberOfUnusedRaidColonySlots: number;
}