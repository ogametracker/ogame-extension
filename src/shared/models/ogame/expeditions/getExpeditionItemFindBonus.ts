import { ExpeditionEventType } from "../../expeditions/ExpeditionEventType";
import { ItemHash } from "../items/ItemHash";


const expeditionBoostItemBonuses: Partial<Record<ItemHash, Partial<Record<ExpeditionEventType, number>>>> = {
    [ItemHash.expedition_resourceBoost_10percent_7days]: { resources: 0.10 },
    [ItemHash.expedition_resourceBoost_15percent_7days]: { resources: 0.15 },
    [ItemHash.expedition_resourceBoost_20percent_7days]: { resources: 0.20 },
    [ItemHash.expedition_resourceBoost_25percent_7days]: { resources: 0.25 },
    [ItemHash.expedition_resourceBoost_30percent_7days]: { resources: 0.30 },
    [ItemHash.expedition_resourceBoost_35percent_7days]: { resources: 0.35 },
    [ItemHash.expedition_resourceBoost_40percent_7days]: { resources: 0.40 },
};

export function getExpeditionItemFindBonus(type: ExpeditionEventType, activeItems: ItemHash[]): number {
    const activeBoostItemId = (Object.keys(expeditionBoostItemBonuses) as ItemHash[])
        .filter(id => expeditionBoostItemBonuses[id]![type] != null)
        .find(id => activeItems.includes(id));

    const boost = expeditionBoostItemBonuses[activeBoostItemId ?? ItemHash.collector]?.[type] ?? 0;
    return boost;
}