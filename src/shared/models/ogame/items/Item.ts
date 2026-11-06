import type { ItemEffect } from './ItemEffect';
import type { ItemGrade } from './ItemGrade';
import type { ItemHash } from './ItemHash';

export interface Item {
    name: string;
    image: string;
    smallImage: string;
    grade: ItemGrade;
    /** The first hash is used when writing an item detected by its image to storage. */
    hashes: readonly [ItemHash, ...ItemHash[]];
    durationSeconds?: number;
    /** Alternate artwork hashes used to recognize the item on the empire page. */
    smallImageAliases?: readonly string[];
    effect?: ItemEffect;
}

export type ItemCatalog<Id extends string = string> = Record<Id, Item>;
