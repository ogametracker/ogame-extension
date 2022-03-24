import { ItemHash } from '../ogame/items/ItemHash';

export type PlanetActiveItems = Partial<Record<ItemHash, number | 'permanent'>>;