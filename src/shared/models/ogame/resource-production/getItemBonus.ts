import { PlanetActiveItems } from "../../empire/PlanetActiveItems";
import { ItemHash } from "../items/ItemHash";
import { ResourceType } from "../resources/ResourceType";

const boostItems: Partial<Record<ItemHash, Partial<Record<ResourceType, number>>>> = {
    [ItemHash.metalBooster_bronze_1day]: { metal: 0.1 },
    [ItemHash.metalBooster_bronze_7days]: { metal: 0.1 },
    [ItemHash.crystalBooster_bronze_1day]: { crystal: 0.1 },
    [ItemHash.crystalBooster_bronze_7days]: { crystal: 0.1 },
    [ItemHash.deuteriumBooster_bronze_1day]: { deuterium: 0.1 },
    [ItemHash.deuteriumBooster_bronze_7days]: { deuterium: 0.1 },

    [ItemHash.metalBooster_silver_7days]: { metal: 0.2 },
    [ItemHash.metalBooster_silver_30days]: { metal: 0.2 },
    [ItemHash.metalBooster_silver_90days]: { metal: 0.2 },
    [ItemHash.crystalBooster_silver_7days]: { crystal: 0.2 },
    [ItemHash.crystalBooster_silver_30days]: { crystal: 0.2 },
    [ItemHash.crystalBooster_silver_90days]: { crystal: 0.2 },
    [ItemHash.deuteriumBooster_silver_7days]: { deuterium: 0.2 },
    [ItemHash.deuteriumBooster_silver_30days]: { deuterium: 0.2 },
    [ItemHash.deuteriumBooster_silver_90days]: { deuterium: 0.2 },

    [ItemHash.metalBooster_gold_7days]: { metal: 0.3 },
    [ItemHash.metalBooster_gold_30days]: { metal: 0.3 },
    [ItemHash.metalBooster_gold_90days]: { metal: 0.3 },
    [ItemHash.crystalBooster_gold_7days]: { crystal: 0.3 },
    [ItemHash.crystalBooster_gold_30days]: { crystal: 0.3 },
    [ItemHash.crystalBooster_gold_90days]: { crystal: 0.3 },
    [ItemHash.deuteriumBooster_gold_7days]: { deuterium: 0.3 },
    [ItemHash.deuteriumBooster_gold_30days]: { deuterium: 0.3 },
    [ItemHash.deuteriumBooster_gold_90days]: { deuterium: 0.3 },

    [ItemHash.metalBooster_platinum_7days]: { metal: 0.4 },
    [ItemHash.metalBooster_platinum_30days]: { metal: 0.4 },
    [ItemHash.metalBooster_platinum_90days]: { metal: 0.4 },
    [ItemHash.crystalBooster_platinum_7days]: { crystal: 0.4 },
    [ItemHash.crystalBooster_platinum_30days]: { crystal: 0.4 },
    [ItemHash.crystalBooster_platinum_90days]: { crystal: 0.4 },
    [ItemHash.deuteriumBooster_platinum_7days]: { deuterium: 0.4 },
    [ItemHash.deuteriumBooster_platinum_30days]: { deuterium: 0.4 },
    [ItemHash.deuteriumBooster_platinum_90days]: { deuterium: 0.4 },

    [ItemHash.resourceBooster_all_15percent_7days]: { metal: 0.15, crystal: 0.15, deuterium: 0.15 },
    [ItemHash.resourceBooster_all_20percent_7days]: { metal: 0.20, crystal: 0.20, deuterium: 0.20 },
    [ItemHash.resourceBooster_all_25percent_7days]: { metal: 0.25, crystal: 0.25, deuterium: 0.25 },
    [ItemHash.resourceBooster_all_30percent_7days]: { metal: 0.30, crystal: 0.30, deuterium: 0.30 },
    [ItemHash.resourceBooster_all_40percent_7days]: { metal: 0.40, crystal: 0.40, deuterium: 0.40 },
}

export function getItemBonus(resource: ResourceType, activeItems: PlanetActiveItems): number {
    const now = Date.now();

    const activeBoostItemId = (Object.keys(boostItems) as ItemHash[])
        .filter(id => boostItems[id]![resource] != null)
        .find(id => isItemActive(now, activeItems[id]));

    const boost = boostItems[activeBoostItemId ?? ItemHash.collector]?.[resource] ?? 0;
    return boost;
}

export function isItemActive(now: number, itemExpiration?: number | 'permanent') {
    if (itemExpiration == null) {
        return false;
    }
    if (itemExpiration == 'permanent') {
        return true;
    }

    return itemExpiration > now;
}