import { PlanetActiveItems } from "../../empire/PlanetActiveItems";
import { ItemHash } from "../items/ItemHash";

export function getItemSlotBonus(activeItems: PlanetActiveItems): number {
    const now = Date.now();
    let bonusSlots = 0;

    const items1 = [
        ItemHash.expeditionslots_bronze_7days, 
        ItemHash.expeditionslots_bronze_7days_pts, 
        ItemHash.expeditionslots_bronze_30days, 
        ItemHash.expeditionslots_bronze_30days_pts, 
        ItemHash.expeditionslots_bronze_90days, 
        ItemHash.expeditionslots_bronze_90days_pts, 
    ];
    if (items1.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
        bonusSlots += 1;
    }

    const items2 = [
        ItemHash.expeditionslots_silver_7days, 
        ItemHash.expeditionslots_silver_7days_pts, 
        ItemHash.expeditionslots_silver_30days, 
        ItemHash.expeditionslots_silver_30days_pts, 
        ItemHash.expeditionslots_silver_90days, 
        ItemHash.expeditionslots_silver_90days_pts, 
    ];
    if (items2.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
        bonusSlots += 2;
    }

    const items3 = [
        ItemHash.expeditionslots_gold_7days, 
        ItemHash.expeditionslots_gold_7days_pts, 
        ItemHash.expeditionslots_gold_30days, 
        ItemHash.expeditionslots_gold_30days_pts, 
        ItemHash.expeditionslots_gold_90days, 
        ItemHash.expeditionslots_gold_90days_pts, 
    ];
    if (items3.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
        bonusSlots += 3;
    }

    return bonusSlots;
}