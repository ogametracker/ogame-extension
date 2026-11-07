import type { Item } from './Item';
import { ItemIds, Items, type ItemId } from './Items.generated';

const idsByHash = new Map<string, ItemId>();
const idsBySmallImage = new Map<string, ItemId[]>();

for (const id of ItemIds) {
    const item = Items[id];
    for (const hash of item.hashes) {
        if (idsByHash.has(hash)) {
            throw new Error(`Duplicate OGame item hash '${hash}'`);
        }
        idsByHash.set(hash, id);
    }

    for (const image of new Set([item.smallImage, ...(item.smallImageAliases ?? [])])) {
        if (!/^[0-9a-f]{40}$/.test(image)) {
            continue;
        }
        const candidates = idsBySmallImage.get(image) ?? [];
        candidates.push(id);
        idsBySmallImage.set(image, candidates);
    }
}

export function resolveItemId(hash: string): ItemId | undefined {
    return idsByHash.get(hash);
}

export function resolveItemIdBySmallImage(image: string, durationSeconds: number): ItemId | undefined {
    const candidates = idsBySmallImage.get(image);
    if (candidates == null || candidates.length === 1) {
        return candidates?.[0];
    }

    const matches = candidates.filter(id => Items[id].durationSeconds === durationSeconds);
    return matches.length === 1 ? matches[0] : undefined;
}

export function getItem(idOrHash: string): Item | undefined {
    const id = Object.prototype.hasOwnProperty.call(Items, idOrHash) ? (idOrHash as ItemId) : resolveItemId(idOrHash);
    return id == null ? undefined : Items[id];
}
