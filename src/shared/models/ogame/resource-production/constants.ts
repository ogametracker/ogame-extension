import { ResourceType } from "../resources/ResourceType";

export const GeologistProductionBonus = 0.1; // 10%
export const CommandStaffProductionBonus = 0.02; // 2%
export const PlasmaTechnologyProductionBonus = {
    [ResourceType.metal]: 0.01, //1%
    [ResourceType.crystal]: 0.0066, //0.66%
    [ResourceType.deuterium]: 0.0033, //0.33%
};
export const AllianceClassTraderProductionBonus = 0.05; //5%