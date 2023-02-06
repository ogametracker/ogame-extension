import { ItemHash } from "../../ogame/items/ItemHash";
import { ResourceType } from "../../ogame/resources/ResourceType";

export interface AmortizationExpeditionSettings {
    include: boolean;
    wavesPerDay: number;
    items: ItemHash[];
    fleetUnitsFactors: Record<ResourceType, number>;
    serverSettings: {
        topScore: number;
        economySpeed: number;
        discovererExpeditionBonus: number;
        discovererExpeditionSlotBonus: number;
    };
}