import type { ItemId } from '../../ogame/items/Items.generated';
import { ResourceType } from '../../ogame/resources/ResourceType';

export interface AmortizationExpeditionSettings {
    wavesPerDay: number;
    items: ItemId[];
    itemResourceBoost: number;
    fleetUnitsFactors: Record<ResourceType, number>;
    serverSettings: {
        topScore: number;
        economySpeed: number;
        discovererExpeditionBonus: number;
        discovererExpeditionSlotBonus: number;
    };
}
