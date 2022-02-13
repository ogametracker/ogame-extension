import { Coordinates } from "../ogame/common/Coordinates";
import { ItemHash } from "../ogame/items/ItemHash";
import { DefenseCount } from './DefenseCount';

export interface PlanetDataBase {
    id: number;
    name: string;
    coordinates: Coordinates;

    defense: DefenseCount;
    activeItems: Partial<Record<ItemHash, number | undefined>>;
}