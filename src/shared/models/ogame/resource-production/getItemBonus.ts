import { PlanetActiveItems } from "../../empire/PlanetActiveItems";
import { ItemHash } from "../items/ItemHash";
import { ResourceType } from "../resources/ResourceType";

export function getItemBonus(resource: ResourceType, activeItems: PlanetActiveItems): number {
    const now = Date.now();

    const items10 = {
        [ResourceType.metal]: [ItemHash.metalBooster_bronze_1day, ItemHash.metalBooster_bronze_7days],
        [ResourceType.crystal]: [ItemHash.crystalBooster_bronze_1day, ItemHash.crystalBooster_bronze_7days],
        [ResourceType.deuterium]: [ItemHash.deuteriumBooster_bronze_1day, ItemHash.deuteriumBooster_bronze_7days],
    }[resource];
    const items20 = {
        [ResourceType.metal]: [ItemHash.metalBooster_silver_7days, ItemHash.metalBooster_silver_30days, ItemHash.metalBooster_silver_90days],
        [ResourceType.crystal]: [ItemHash.crystalBooster_silver_7days, ItemHash.crystalBooster_silver_30days, ItemHash.crystalBooster_silver_90days],
        [ResourceType.deuterium]: [ItemHash.deuteriumBooster_silver_7days, ItemHash.deuteriumBooster_silver_30days, ItemHash.deuteriumBooster_silver_90days],
    }[resource];
    const items30 = {
        [ResourceType.metal]: [ItemHash.metalBooster_gold_7days, ItemHash.metalBooster_gold_30days, ItemHash.metalBooster_gold_90days],
        [ResourceType.crystal]: [ItemHash.crystalBooster_gold_7days, ItemHash.crystalBooster_gold_30days, ItemHash.crystalBooster_gold_90days],
        [ResourceType.deuterium]: [ItemHash.deuteriumBooster_gold_7days, ItemHash.deuteriumBooster_gold_30days, ItemHash.deuteriumBooster_gold_90days],
    }[resource];
    const items40 = {
        [ResourceType.metal]: [ItemHash.metalBooster_platinum_7days, ItemHash.metalBooster_platinum_30days, ItemHash.metalBooster_platinum_90days],
        [ResourceType.crystal]: [ItemHash.crystalBooster_platinum_7days, ItemHash.crystalBooster_platinum_30days, ItemHash.crystalBooster_platinum_90days],
        [ResourceType.deuterium]: [ItemHash.deuteriumBooster_platinum_7days, ItemHash.deuteriumBooster_platinum_30days, ItemHash.deuteriumBooster_platinum_90days],
    }[resource];

    if (items10.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
        return 0.1;
    }
    if (items20.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
        return 0.2;
    }
    if (items30.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
        return 0.3;
    }
    if (items40.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
        return 0.4;
    }

    return 0;
}