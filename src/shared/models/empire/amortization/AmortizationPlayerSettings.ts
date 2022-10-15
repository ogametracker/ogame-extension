import { AllianceClass } from "@/shared/models/ogame/classes/AllianceClass";
import { PlayerClass } from "@/shared/models/ogame/classes/PlayerClass";
import { ValidLifeformType } from "../../ogame/lifeforms/LifeformType";
import { ResourceType } from "../../ogame/resources/ResourceType";

export interface AmortizationPlayerSettings {
    optimizeForResources: ResourceType[];
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
    lifeformLevels: Record<ValidLifeformType, number>;
}