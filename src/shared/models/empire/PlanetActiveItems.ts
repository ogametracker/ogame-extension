import type { ItemHash } from '../ogame/items/ItemHash';
import { resolveItemId } from '../ogame/items/ItemLookup';
import type { ItemId } from '../ogame/items/Items.generated';

type ItemExpiry = number | 'permanent';

export type ActiveItemHashes = Partial<Record<ItemHash, ItemExpiry>>;
export type PlanetActiveItems = Partial<Record<ItemId, ItemExpiry>>;

export function setActiveItemExpiry<Key extends string>(
    items: Partial<Record<Key, ItemExpiry>>,
    key: Key,
    expiry: ItemExpiry,
): void {
    const previous = items[key];
    if (previous == null || expiry === 'permanent' || (typeof previous === 'number' && expiry > previous)) {
        items[key] = expiry;
    }
}

export function resolveActiveItems(hashes: ActiveItemHashes): PlanetActiveItems {
    const activeItems: PlanetActiveItems = {};
    for (const [hash, expiry] of Object.entries(hashes)) {
        const id = resolveItemId(hash);
        if (id != null && expiry != null) {
            setActiveItemExpiry(activeItems, id, expiry);
        }
    }
    return activeItems;
}
