import { ItemHash } from "../../ogame/items/ItemHash";
import { ResourceType } from "../../ogame/resources/ResourceType";

export interface AmortizationExpeditionSettings {
    wavesPerDay: number;
    items: ItemHash[];
    fleetUnitsFactors: Record<ResourceType, number>;
    useSmallCargos: boolean;
}